#!/bin/bash

# SmileCare Dental Scheduling System - AWS EKS Deployment Script
# Usage: ./scripts/deploy.sh [environment]
# Environment: dev, staging, prod (default: dev)

set -e

# Configuration
ENVIRONMENT=${1:-dev}
AWS_REGION=${AWS_REGION:-us-west-2}
ECR_REPOSITORY=${ECR_REPOSITORY:-smilecare-dental}
CLUSTER_NAME=${CLUSTER_NAME:-smilecare-dental-${ENVIRONMENT}}
IMAGE_TAG=${IMAGE_TAG:-$(git rev-parse --short HEAD)}

echo "🚀 Deploying SmileCare Dental to AWS EKS"
echo "Environment: $ENVIRONMENT"
echo "Region: $AWS_REGION"
echo "Cluster: $CLUSTER_NAME"
echo "Image Tag: $IMAGE_TAG"

# Check prerequisites
command -v aws >/dev/null 2>&1 || { echo "❌ AWS CLI is required but not installed." >&2; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo "❌ kubectl is required but not installed." >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed." >&2; exit 1; }

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"

echo "📋 AWS Account: $AWS_ACCOUNT_ID"
echo "📋 ECR URI: $ECR_URI"

# Step 1: Create ECR repository if it doesn't exist
echo "🏗️  Creating ECR repository..."
aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION 2>/dev/null || \
aws ecr create-repository --repository-name $ECR_REPOSITORY --region $AWS_REGION

# Step 2: Login to ECR
echo "🔑 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI

# Step 3: Build Docker image
echo "🔨 Building Docker image..."
docker build -t $ECR_REPOSITORY:$IMAGE_TAG .
docker tag $ECR_REPOSITORY:$IMAGE_TAG $ECR_URI:$IMAGE_TAG
docker tag $ECR_REPOSITORY:$IMAGE_TAG $ECR_URI:latest

# Step 4: Push to ECR
echo "📤 Pushing image to ECR..."
docker push $ECR_URI:$IMAGE_TAG
docker push $ECR_URI:latest

# Step 5: Update kubeconfig
echo "⚙️  Updating kubeconfig for cluster $CLUSTER_NAME..."
aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME

# Step 6: Update deployment manifests
echo "📝 Updating Kubernetes manifests..."
sed -i.bak "s|<account-id>|$AWS_ACCOUNT_ID|g" k8s/deployment.yaml
sed -i.bak "s|us-west-2|$AWS_REGION|g" k8s/deployment.yaml
sed -i.bak "s|:latest|:$IMAGE_TAG|g" k8s/deployment.yaml

# Step 7: Apply Kubernetes manifests
echo "🚀 Deploying to Kubernetes..."

# Apply namespace first
kubectl apply -f k8s/namespace.yaml

# Apply ConfigMap and Secrets
echo "📊 Applying ConfigMap and Secrets..."
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# Apply Deployment and Service
echo "🎯 Applying Deployment and Service..."
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Apply HPA
echo "📈 Applying Horizontal Pod Autoscaler..."
kubectl apply -f k8s/hpa.yaml

# Apply Ingress (optional)
if [ -f "k8s/ingress.yaml" ]; then
    echo "🌐 Applying Ingress..."
    kubectl apply -f k8s/ingress.yaml
fi

# Step 8: Wait for deployment
echo "⏳ Waiting for deployment to be ready..."
kubectl rollout status deployment/smilecare-dental -n smilecare-dental --timeout=300s

# Step 9: Get deployment info
echo "ℹ️  Deployment information:"
kubectl get pods -n smilecare-dental
kubectl get services -n smilecare-dental
kubectl get ingress -n smilecare-dental 2>/dev/null || echo "No ingress configured"

# Step 10: Show logs
echo "📋 Recent logs:"
kubectl logs -n smilecare-dental deployment/smilecare-dental --tail=20

# Cleanup backup files
rm -f k8s/*.bak

echo "✅ Deployment completed successfully!"
echo ""
echo "🔍 To check status:"
echo "  kubectl get pods -n smilecare-dental"
echo "  kubectl logs -n smilecare-dental deployment/smilecare-dental"
echo ""
echo "🔧 To access the application:"
echo "  kubectl port-forward -n smilecare-dental service/smilecare-dental-service 8080:80"
echo "  Then visit: http://localhost:8080"