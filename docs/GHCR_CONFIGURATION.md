# GitHub Container Registry (GHCR) Configuration

## Overview

THEJORD uses GitHub Container Registry (ghcr.io) to store Docker images for both web and API applications. The images are pulled by K3s cluster running on Proxmox LXC container.

## Current Configuration (December 2024)

### Public Packages - No Credentials Required

The GHCR packages are configured as **public**, which means:
- No authentication required to pull images
- No `imagePullSecrets` needed in Kubernetes deployments
- No token expiration issues
- Most stable and maintenance-free approach

### Image Registry

- **Registry**: `ghcr.io`
- **Organization**: `thejord-it`
- **Packages**:
  - `ghcr.io/thejord-it/thejord-web`
  - `ghcr.io/thejord-it/thejord-api`

### Image Tagging Strategy

Images are tagged with the **commit SHA** (not `latest`):
- Production: Uses specific commit SHA from `master` branch
- Staging: Uses specific commit SHA from `develop` branch

Example: `ghcr.io/thejord-it/thejord-web:21a6fef`

## K3s Configuration

### Namespaces

- `thejord` - Production environment
- `thejord-staging` - Staging environment

### Deployment Configuration

Deployments do **NOT** use `imagePullSecrets`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: thejord-web
  namespace: thejord
spec:
  template:
    spec:
      containers:
        - name: thejord-web
          image: ghcr.io/thejord-it/thejord-web:COMMIT_SHA
      # NO imagePullSecrets - using anonymous access for public packages
```

### Proxmox/K3s Access

```bash
# SSH to Proxmox host
ssh root@192.168.1.200

# Execute kubectl commands inside K3s LXC container (ID: 102)
pct exec 102 -- /usr/local/bin/k3s kubectl get pods -n thejord
```

## Troubleshooting

### ImagePullBackOff Error

If pods show `ImagePullBackOff` status:

1. **Check if ghcr-secret exists with invalid credentials**:
   ```bash
   ssh root@192.168.1.200 "pct exec 102 -- /usr/local/bin/k3s kubectl get secrets -n thejord"
   ```

2. **If ghcr-secret exists, remove it** (public packages don't need it):
   ```bash
   ssh root@192.168.1.200 "pct exec 102 -- /usr/local/bin/k3s kubectl delete secret ghcr-secret -n thejord"
   ssh root@192.168.1.200 "pct exec 102 -- /usr/local/bin/k3s kubectl delete secret ghcr-secret -n thejord-staging"
   ```

3. **Remove imagePullSecrets from deployment** (if present):
   ```bash
   ssh root@192.168.1.200 "pct exec 102 -- /usr/local/bin/k3s kubectl patch deployment thejord-web -n thejord --type=json -p='[{\"op\": \"remove\", \"path\": \"/spec/template/spec/imagePullSecrets\"}]'"
   ```

4. **Verify pods restart successfully**:
   ```bash
   ssh root@192.168.1.200 "pct exec 102 -- /usr/local/bin/k3s kubectl get pods -n thejord"
   ```

### Creating Credentials (If Private Packages)

If you need to switch to private packages, create a GitHub PAT with **no expiration**:

1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select "No expiration"
4. Enable only `read:packages` scope
5. Create the secret:
   ```bash
   kubectl create secret docker-registry ghcr-secret \
     --docker-server=ghcr.io \
     --docker-username=YOUR_GITHUB_USERNAME \
     --docker-password=ghp_YOUR_TOKEN \
     -n thejord
   ```
6. Add `imagePullSecrets` to deployments

## CI/CD Pipeline

GitHub Actions workflow handles:
1. Build Docker image
2. Tag with commit SHA
3. Push to ghcr.io
4. SSH to Proxmox and update K3s deployment with new image tag

See `.github/workflows/deploy.yml` for details.

## Best Practices

1. **Keep packages public** - Avoids credential management and expiration issues
2. **Use commit SHA tags** - Ensures reproducible deployments
3. **Monitor pod status** - Use `kubectl get pods` to verify deployments
4. **Check events on failure** - Use `kubectl describe pod POD_NAME` for details

## Last Updated

- **Date**: December 5, 2024
- **Status**: Working with anonymous access (no credentials)
- **Verified**: All pods running successfully
