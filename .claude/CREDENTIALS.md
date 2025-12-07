# THEJORD Admin Credentials & Token Management

## Admin Credentials

```
Email: admin@thejord.it
Password: [chiedi all'utente se non lo sai]
```

## Come Ottenere un Token Valido

### Produzione (thejord.it)

```bash
curl -X POST https://thejord.it/api/proxy/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@thejord.it","password":"PASSWORD_HERE"}' \
  | jq -r '.data.token'
```

### Staging (staging.thejord.it)

```bash
curl -X POST https://staging.thejord.it/api/proxy/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@thejord.it","password":"PASSWORD_HERE"}' \
  | jq -r '.data.token'
```

## Workflow Automatico

Prima di eseguire script che richiedono ADMIN_TOKEN:

1. Chiama l'endpoint login per ottenere un token fresco
2. Usa il token per le operazioni successive

### Esempio Completo

```bash
# 1. Login e salva token
TOKEN=$(curl -s -X POST https://thejord.it/api/proxy/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@thejord.it","password":"PASSWORD"}' \
  | jq -r '.data.token')

# 2. Usa il token
ADMIN_TOKEN=$TOKEN npx tsx scripts/create-tool-posts.ts
```

## Token Attuali (scadono dopo 7 giorni)

### Produzione
- Token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjRiYzllMS00ZDcxLTQ1NmItYjI4MS0xNjNlZmVhMzM2MDQiLCJlbWFpbCI6ImFkbWluQHRoZWpvcmQuaXQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjQ3MDk2NjUsImV4cCI6MTc2NTMxNDQ2NX0.tNyrhgUQ8SKdDxKjjT7IaHDvAWOQZFngtVGpSnJ-GoA`
- Scadenza: ~7 giorni dalla creazione

### Staging
- Token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMTc0ZTgyMC01ZGRkLTQxNDMtOGFkOS05NmI4NzlhOGM5YTciLCJlbWFpbCI6ImFkbWluQHRoZWpvcmQuaXQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjQ2OTk4ODQsImV4cCI6MTc2NTMwNDY4NH0.QzUV2G8YBwjztEYu8NBS1rXI0zTWNbheCh7cAXSvqxU`
- Scadenza: ~7 giorni dalla creazione

## Note

- I token JWT scadono dopo 7 giorni
- Produzione e Staging hanno JWT_SECRET diversi, quindi token diversi
- Se ricevi errore 401 "Invalid token", il token è scaduto o per ambiente sbagliato
