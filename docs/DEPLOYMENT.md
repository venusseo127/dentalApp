# Deployment Guide: SmileCare Dental Scheduling System

## Overview

This guide provides comprehensive instructions for deploying the SmileCare Dental Scheduling System on AWS using Kubernetes. The application consists of a React frontend and Express.js backend, integrated with Firebase Authentication and Firestore database.

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth with Google OAuth
- **Infrastructure**: AWS EKS (Kubernetes)
- **Container Registry**: AWS ECR

## Prerequisites

- AWS CLI configured with appropriate permissions
- kubectl installed and configured
- Docker installed
- Node.js 18+ and npm
- Firebase project with API keys

## Firebase Setup

### 1. Firebase Console Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication and Firestore Database
4. Configure Google Sign-in:
   - Go to Authentication > Sign-in method
   - Enable Google sign-in

### 2. Required Environment Variables

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# Production Settings
NODE_ENV=production
PORT=5000
```

## AWS Infrastructure Setup

### 1. Create EKS Cluster

```bash
# Install eksctl if not already installed
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Create EKS cluster
eksctl create cluster \
  --name smilecare-dental \
  --region us-west-2 \
  --nodegroup-name workers \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 4
```

### 2. Create ECR Repository

```bash
# Create ECR repository
aws ecr create-repository --repository-name smilecare-dental --region us-west-2

# Get login token
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-west-2.amazonaws.com
```

## Application Containerization

### 1. Create Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

USER nodejs

EXPOSE 5000

CMD ["npm", "start"]
```

### 2. Build and Push Docker Image

```bash
# Build Docker image
docker build -t smilecare-dental .

# Tag for ECR
docker tag smilecare-dental:latest <account-id>.dkr.ecr.us-west-2.amazonaws.com/smilecare-dental:latest

# Push to ECR
docker push <account-id>.dkr.ecr.us-west-2.amazonaws.com/smilecare-dental:latest
```

## Kubernetes Deployment

### 1. Create Namespace

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: smilecare-dental
```

### 2. Create ConfigMap for Environment Variables

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: smilecare-config
  namespace: smilecare-dental
data:
  NODE_ENV: "production"
  PORT: "5000"
  FIREBASE_PROJECT_ID: "your-project-id"
  VITE_FIREBASE_AUTH_DOMAIN: "your-project-id.firebaseapp.com"
  VITE_FIREBASE_PROJECT_ID: "your-project-id"
  VITE_FIREBASE_STORAGE_BUCKET: "your-project-id.appspot.com"
```

### 3. Create Secret for Sensitive Data

```yaml
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: smilecare-secrets
  namespace: smilecare-dental
type: Opaque
data:
  VITE_FIREBASE_API_KEY: <base64-encoded-api-key>
  VITE_FIREBASE_APP_ID: <base64-encoded-app-id>
  VITE_FIREBASE_MESSAGING_SENDER_ID: <base64-encoded-sender-id>
```

### 4. Create Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: smilecare-dental
  namespace: smilecare-dental
spec:
  replicas: 3
  selector:
    matchLabels:
      app: smilecare-dental
  template:
    metadata:
      labels:
        app: smilecare-dental
    spec:
      containers:
      - name: smilecare-dental
        image: <account-id>.dkr.ecr.us-west-2.amazonaws.com/smilecare-dental:latest
        ports:
        - containerPort: 5000
        envFrom:
        - configMapRef:
            name: smilecare-config
        - secretRef:
            name: smilecare-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### 5. Create Service

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: smilecare-dental-service
  namespace: smilecare-dental
spec:
  selector:
    app: smilecare-dental
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
  type: ClusterIP
```

### 6. Create Ingress

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: smilecare-dental-ingress
  namespace: smilecare-dental
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - your-domain.com
    secretName: smilecare-tls
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: smilecare-dental-service
            port:
              number: 80
```

## Deployment Commands

### 1. Apply Kubernetes Manifests

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Apply all configurations
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

### 2. Install NGINX Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/aws/deploy.yaml
```

### 3. Install Cert-Manager for SSL

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml
```

## Monitoring and Scaling

### 1. Horizontal Pod Autoscaler

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: smilecare-dental-hpa
  namespace: smilecare-dental
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: smilecare-dental
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### 2. Monitoring with Prometheus

```bash
# Add Prometheus Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

## CI/CD Pipeline

### 1. GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS EKS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-west-2
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build and push Docker image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: smilecare-dental
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
    
    - name: Update kube config
      run: aws eks update-kubeconfig --name smilecare-dental --region us-west-2
    
    - name: Deploy to EKS
      run: |
        sed -i.bak "s|<IMAGE>|$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG|g" k8s/deployment.yaml
        kubectl apply -f k8s/
```

## Security Best Practices

1. **Network Security**
   - Use AWS Security Groups to restrict access
   - Implement Network Policies in Kubernetes
   - Enable VPC Flow Logs

2. **Application Security**
   - Regular security scans with tools like Snyk
   - Keep dependencies updated
   - Use HTTPS everywhere

3. **Access Control**
   - Implement RBAC in Kubernetes
   - Use IAM roles for service accounts
   - Regular access reviews

## Backup and Recovery

1. **Database Backup**
   - Firebase Firestore automatic backups
   - Configure retention policies

2. **Application Backup**
   - Regular ECR image snapshots
   - Kubernetes resource backups with Velero

## Troubleshooting

### Common Issues

1. **Pod Startup Issues**
   ```bash
   kubectl logs -n smilecare-dental deployment/smilecare-dental
   kubectl describe pod -n smilecare-dental <pod-name>
   ```

2. **Network Issues**
   ```bash
   kubectl get svc -n smilecare-dental
   kubectl get ingress -n smilecare-dental
   ```

3. **Authentication Issues**
   - Verify Firebase domain settings
   - Check environment variables
   - Validate API keys

## Cost Optimization

1. **Right-sizing**
   - Monitor resource usage
   - Adjust pod resource requests/limits
   - Use spot instances for non-critical workloads

2. **Auto-scaling**
   - Configure HPA for dynamic scaling
   - Use cluster autoscaler
   - Schedule scaling during low-traffic periods

## Maintenance

1. **Updates**
   - Regular Kubernetes version updates
   - Node group updates
   - Application dependency updates

2. **Monitoring**
   - Set up alerts for critical metrics
   - Regular health checks
   - Performance monitoring

This deployment guide provides a production-ready setup for the SmileCare Dental Scheduling System on AWS Kubernetes with proper security, scaling, and monitoring capabilities.