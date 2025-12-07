# THEJORD - Claude Code Reference

Documentazione per sessioni future. Leggere prima di iniziare task amministrativi.

---

## Infrastruttura

### Server Proxmox
- **IP**: 192.168.1.200
- **SSH**: `ssh root@192.168.1.200`
- **Web UI**: https://192.168.1.200:8006
- **Tailscale**: 100.71.84.111

### Container LXC Rilevanti
| ID | Nome | IP | Uso |
|----|------|-----|-----|
| 102 | k3s | 192.168.1.212 | Kubernetes cluster |
| 105 | github-runner | - | CI/CD |

### K3s Access
```bash
# kubectl non è nel PATH, usare path completo
ssh root@192.168.1.200 "pct exec 102 -- bash -c '/usr/local/bin/kubectl <comando>'"

# Esempi
ssh root@192.168.1.200 "pct exec 102 -- bash -c '/usr/local/bin/kubectl get pods -n thejord'"
ssh root@192.168.1.200 "pct exec 102 -- bash -c '/usr/local/bin/kubectl get deploy -n thejord'"
ssh root@192.168.1.200 "pct exec 102 -- bash -c '/usr/local/bin/kubectl logs -n thejord deploy/thejord-api --tail=50'"
```

---

## Ambienti THEJORD

| Ambiente | URL | Database | JWT Secret |
|----------|-----|----------|------------|
| Produzione | https://thejord.it | thejord_db | Prod secret |
| Staging | https://staging.thejord.it | thejord_db_dev | Staging secret |
| Locale | http://localhost:3001 | locale | Dev secret |

**Nota**: Ogni ambiente ha JWT_SECRET diverso, quindi token diversi!

---

## Autenticazione API

### Endpoint Login
```
POST /api/proxy/api/auth/login
Content-Type: application/json
Body: {"email": "admin@thejord.it", "password": "PASSWORD"}
Response: {"success": true, "data": {"token": "eyJ..."}}
```

### Ottenere Token Fresco

```bash
# Produzione
curl -s -X POST https://thejord.it/api/proxy/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@thejord.it","password":"PASSWORD"}' \
  | jq -r '.data.token'

# Staging
curl -s -X POST https://staging.thejord.it/api/proxy/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@thejord.it","password":"PASSWORD"}' \
  | jq -r '.data.token'
```

### Token Attuali (scadono dopo 7 giorni)

**Produzione** (thejord.it):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjRiYzllMS00ZDcxLTQ1NmItYjI4MS0xNjNlZmVhMzM2MDQiLCJlbWFpbCI6ImFkbWluQHRoZWpvcmQuaXQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjQ3MDk2NjUsImV4cCI6MTc2NTMxNDQ2NX0.tNyrhgUQ8SKdDxKjjT7IaHDvAWOQZFngtVGpSnJ-GoA
```

**Staging** (staging.thejord.it):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMTc0ZTgyMC01ZGRkLTQxNDMtOGFkOS05NmI4NzlhOGM5YTciLCJlbWFpbCI6ImFkbWluQHRoZWpvcmQuaXQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjQ2OTk4ODQsImV4cCI6MTc2NTMwNDY4NH0.QzUV2G8YBwjztEYu8NBS1rXI0zTWNbheCh7cAXSvqxU
```

---

## Database Access

### Via K3s Pod
```bash
# Query diretta su produzione
ssh root@192.168.1.200 "pct exec 102 -- bash -c '/usr/local/bin/kubectl exec -n thejord deploy/thejord-db -- psql -U thejord -d thejord_db -c \"SELECT COUNT(*) FROM blog_posts\"'"
```

### Credenziali
- **User**: thejord
- **Database Prod**: thejord_db
- **Database Staging**: thejord_db_dev

---

## Script Blog Posts

### Pubblicare Post
```bash
# Produzione
ADMIN_TOKEN=xxx npx tsx scripts/create-tool-posts.ts

# Staging
ADMIN_TOKEN=xxx npx tsx scripts/create-tool-posts.ts --staging

# Dry run
npx tsx scripts/create-tool-posts.ts --dry-run
```

### Struttura Script
```
scripts/
├── create-tool-posts.ts      # 5 tool (10 post)
├── create-xml-wsdl-posts.ts  # XML/WSDL (2 post)
├── content-*.html            # Contenuti HTML
└── README.md                 # Documentazione
```

---

## Comandi Utili

### Verifica Stato Cluster
```bash
ssh root@192.168.1.200 "pct exec 102 -- bash -c '/usr/local/bin/kubectl get pods -n thejord'"
```

### Logs API
```bash
ssh root@192.168.1.200 "pct exec 102 -- bash -c '/usr/local/bin/kubectl logs -n thejord deploy/thejord-api --tail=100'"
```

### Restart Deployment
```bash
ssh root@192.168.1.200 "pct exec 102 -- bash -c '/usr/local/bin/kubectl rollout restart -n thejord deploy/thejord-api'"
ssh root@192.168.1.200 "pct exec 102 -- bash -c '/usr/local/bin/kubectl rollout restart -n thejord deploy/thejord-web'"
```

### Secrets
```bash
# Lista secrets
ssh root@192.168.1.200 "pct exec 102 -- bash -c '/usr/local/bin/kubectl get secrets -n thejord'"

# Leggi secret
ssh root@192.168.1.200 "pct exec 102 -- bash -c '/usr/local/bin/kubectl get secret thejord-api-secrets -n thejord -o jsonpath=\"{.data}\"'"
```

---

## Troubleshooting

### Token 401 Invalid
1. Token scaduto (durata 7 giorni)
2. Token per ambiente sbagliato (prod vs staging)
3. Soluzione: Ottenere nuovo token via login API

### Pod CrashLoopBackOff
```bash
ssh root@192.168.1.200 "pct exec 102 -- bash -c '/usr/local/bin/kubectl describe pod -n thejord <pod-name>'"
```

### Database Connection
```bash
# Test connessione
ssh root@192.168.1.200 "pct exec 102 -- bash -c '/usr/local/bin/kubectl exec -n thejord deploy/thejord-api -- nc -zv 192.168.1.212 5432'"
```

---

## File Correlati

- `C:\Projects\proxmox\docs\00-QUICK-REFERENCE.md` - Infrastruttura completa
- `C:\Projects\proxmox\k8s\thejord\README.md` - Deploy K8s guide
- `.claude/CREDENTIALS.md` - Token e credenziali attuali
- `scripts/README.md` - Documentazione script blog
