#!/bin/bash
# Initial deployment script for thejord
# Run this once to set up the K8s resources

set -e

echo "=== THEJORD Initial Deployment ==="

# Check if namespace exists
if ! kubectl get namespace thejord &>/dev/null; then
  echo "Creating namespace thejord..."
  kubectl create namespace thejord
fi

# Check if secrets exist
if ! kubectl get secret thejord-secrets -n thejord &>/dev/null; then
  echo ""
  echo "ERROR: Secrets not configured!"
  echo "Please create secrets first:"
  echo ""
  echo "1. Copy k8s/secrets.yaml.template to k8s/secrets.yaml"
  echo "2. Fill in the real values"
  echo "3. Run: kubectl apply -f k8s/secrets.yaml"
  echo ""
  echo "4. Create GHCR secret:"
  echo "   kubectl create secret docker-registry ghcr-secret \\"
  echo "     --namespace=thejord \\"
  echo "     --docker-server=ghcr.io \\"
  echo "     --docker-username=YOUR_GITHUB_USERNAME \\"
  echo "     --docker-password=YOUR_GITHUB_TOKEN"
  exit 1
fi

echo "Deploying thejord-web..."
kubectl apply -f k8s/deployment.yaml

echo ""
echo "Deploying thejord-api..."
cd ../thejord-api
kubectl apply -f k8s/deployment.yaml

echo ""
echo "=== Deployment Status ==="
kubectl get pods -n thejord
kubectl get ingress -n thejord

echo ""
echo "=== Done! ==="
echo "Web: https://thejord.it"
echo "API: https://api.thejord.it"
