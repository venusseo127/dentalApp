# AWS Kubernetes Quick Setup Guide

## Prerequisites
- AWS CLI installed and configured
- Docker installed  
- kubectl installed
- eksctl installed
- Helm installed

## Quick Start Commands

### 1. Set up AWS Infrastructure (15-20 minutes)
```bash
# Make scripts executable
chmod +x scripts/setup-aws-infrastructure.sh scripts/deploy.sh

# Set up complete AWS infrastructure
./scripts/setup-aws-infrastructure.sh dev
```

### 2. Configure Firebase Secrets
```bash
# Encode your Firebase secrets to base64
echo -n "your-firebase-api-key" | base64
echo -n "your-firebase-app-id" | base64  
echo -n "your-messaging-sender-id" | base64

# Update k8s/secret.yaml with the encoded values
# Update k8s/configmap.yaml with your project ID
```

### 3. Deploy Application
```bash
./scripts/deploy.sh dev
```

## Manual Setup Steps

### Create EKS Cluster
```bash
eksctl create cluster \
  --name smilecare-dental \
  --region us-west-2 \
  --nodegroup-name workers \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 4
```

### Install Required Components
```bash
# NGINX Ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/aws/deploy.yaml

# Cert-Manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml

# Metrics Server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

### Deploy Application
```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/ingress.yaml
```

## Monitoring Commands

```bash
# Check pod status
kubectl get pods -n smilecare-dental

# View logs
kubectl logs -n smilecare-dental deployment/smilecare-dental

# Check services
kubectl get services -n smilecare-dental

# Port forward for local access
kubectl port-forward -n smilecare-dental service/smilecare-dental-service 8080:80
```

## Environment Variables Needed

Update these in k8s/configmap.yaml and k8s/secret.yaml:
- FIREBASE_PROJECT_ID
- VITE_FIREBASE_API_KEY  
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_STORAGE_BUCKET

## Access Your Application

After deployment, access via:
- LoadBalancer DNS name (check `kubectl get ingress`)
- Port forwarding: `kubectl port-forward -n smilecare-dental service/smilecare-dental-service 8080:80`