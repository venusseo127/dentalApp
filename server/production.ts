import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging helper
function log(message: string) {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [express] ${message}`);
}

// API request logging
app.use((req, res, next) => {
  const start = Date.now();
  let capturedJson: any;

  const originalJson = res.json;
  res.json = function (body, ...args) {
    capturedJson = body;
    return originalJson.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      const duration = Date.now() - start;
      let logLine = `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;
      if (capturedJson) {
        logLine += ` :: ${JSON.stringify(capturedJson)}`;
      }
      if (logLine.length > 100) {
        logLine = logLine.slice(0, 99) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// Serve static files for production
function serveStaticFiles(app: express.Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `❌ Could not find build directory: ${distPath}. Run "npm run build" first.`
    );
  }

  // Serve all static assets
  app.use(express.static(distPath));

  // Fallback for SPA routes (non-API)
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();

    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) {
        log(`Error serving index.html: ${err.message}`);
        res.status(500).send("Internal Server Error");
      }
    });
  });
}

// Start server
(async () => {
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    log(`❌ Error: ${message}`);
    res.status(status).json({ message });
  });

  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`✅ Server running on port ${port}`);
  });
})();
