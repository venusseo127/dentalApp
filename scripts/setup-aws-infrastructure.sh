#!/bin/bash

# SmileCare Dental - AWS Infrastructure Setup Script
# This script sets up the complete AWS infrastructure for the dental scheduling system

set -e

# Configuration
ENVIRONMENT=${1:-dev}
AWS_REGION=${AWS_REGION:-us-west-2}
CLUSTER_NAME="smilecare-dental-${ENVIRONMENT}"
NODE_GROUP_NAME="workers"
VPC_NAME="smilecare-vpc-${ENVIRONMENT}"

echo "🏗️  Setting up AWS infrastructure for SmileCare Dental"
echo "Environment: $ENVIRONMENT"
echo "Region: $AWS_REGION"
echo "Cluster: $CLUSTER_NAME"

# Check prerequisites
command -v aws >/dev/null 2>&1 || { echo "❌ AWS CLI is required but not installed." >&2; exit 1; }
command -v eksctl >/dev/null 2>&1 || { echo "❌ eksctl is required but not installed." >&2; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo "❌ kubectl is required but not installed." >&2; exit 1; }
command -v helm >/dev/null 2>&1 || { echo "❌ Helm is required but not installed." >&2; exit 1; }

# Verify AWS credentials
echo "🔑 Verifying AWS credentials..."
aws sts get-caller-identity

# Step 1: Create EKS cluster
echo "🎯 Creating EKS cluster: $CLUSTER_NAME"
eksctl create cluster \
  --name $CLUSTER_NAME \
  --region $AWS_REGION \
  --nodegroup-name $NODE_GROUP_NAME \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed \
  --with-oidc \
  --ssh-access \
  --ssh-public-key ~/.ssh/id_rsa.pub \
  --full-ecr-access

# Step 2: Install AWS Load Balancer Controller
echo "🔗 Installing AWS Load Balancer Controller..."
curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.5.4/docs/install/iam_policy.json

aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://iam_policy.json \
    2>/dev/null || echo "Policy already exists"

eksctl create iamserviceaccount \
  --cluster=$CLUSTER_NAME \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn=arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/AWSLoadBalancerControllerIAMPolicy \
  --approve

helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=$CLUSTER_NAME \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

# Step 3: Install NGINX Ingress Controller
echo "🌐 Installing NGINX Ingress Controller..."
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer

# Step 4: Install Cert-Manager for SSL
echo "🔒 Installing Cert-Manager..."
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.13.0 \
  --set installCRDs=true

# Wait for cert-manager to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=300s

# Create ClusterIssuer for Let's Encrypt
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@smilecare-dental.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

# Step 5: Install Metrics Server
echo "📊 Installing Metrics Server..."
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Step 6: Install Prometheus and Grafana for monitoring
echo "📈 Installing Prometheus and Grafana..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set grafana.adminPassword=admin \
  --set grafana.service.type=LoadBalancer

# Step 7: Create ECR repository
echo "📦 Creating ECR repository..."
aws ecr describe-repositories --repository-names smilecare-dental --region $AWS_REGION 2>/dev/null || \
aws ecr create-repository --repository-name smilecare-dental --region $AWS_REGION

# Step 8: Update kubeconfig
echo "⚙️  Updating kubeconfig..."
aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME

# Step 9: Create namespace for application
echo "📁 Creating application namespace..."
kubectl create namespace smilecare-dental --dry-run=client -o yaml | kubectl apply -f -

# Step 10: Display cluster information
echo "ℹ️  Cluster Information:"
kubectl cluster-info
kubectl get nodes
kubectl get namespaces

echo "✅ AWS infrastructure setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update your Firebase authorized domains with the LoadBalancer DNS name"
echo "2. Configure your DNS to point to the LoadBalancer"
echo "3. Update k8s/configmap.yaml with your Firebase configuration"
echo "4. Update k8s/secret.yaml with your Firebase secrets (base64 encoded)"
echo "5. Run: ./scripts/deploy.sh $ENVIRONMENT"
echo ""
echo "🔍 Useful commands:"
echo "  kubectl get all -n smilecare-dental"
echo "  kubectl logs -n smilecare-dental deployment/smilecare-dental"
echo "  kubectl get ingress -n smilecare-dental"
echo ""
echo "🌐 Access Grafana dashboard:"
echo "  kubectl port-forward -n monitoring service/prometheus-grafana 3000:80"
echo "  Then visit: http://localhost:3000 (admin/admin)"

# Cleanup
rm -f iam_policy.json