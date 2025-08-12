# ===== Stage 1: Build =====
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install ALL dependencies (not just prod) for build
RUN npm ci

# Copy source code (this ensures vite.config.ts, client/, shared/, server/ are present)
COPY . .

# Build frontend
RUN npm run build

# Bundle server
RUN npx esbuild server/production.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outfile=dist/server.js

# ===== Stage 2: Production =====
FROM node:18-alpine AS production

WORKDIR /app

RUN apk add --no-cache dumb-init

# Copy compiled output + necessary runtime files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# If your server needs static files:
COPY --from=builder /app/dist/public ./dist/public

ENV NODE_ENV=production
ENV PORT=5000

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
    const options = { host: 'localhost', port: 5000, path: '/health', timeout: 2000 }; \
    const req = http.request(options, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); \
    req.on('error', () => process.exit(1)); req.end();"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
