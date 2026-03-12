---
description: Kundendaten zurücksetzen — D1, R2, KV leeren vor Übergabe
---

# /reset — Tabula Rasa vor Kundenübergabe

Setzt alle Runtime-Daten zurück (Posts, Bilder, Interview-Extrakte), ohne Code oder Konfiguration zu verändern. Statische Daten (Instanzen, Topics, Quotes, Prompts) bleiben erhalten.

## Voraussetzungen

- `wrangler` CLI installiert und authentifiziert
- Zugriff auf Cloudflare Dashboard (für R2)

## Schritte

### 1. D1 Database zurücksetzen (Remote)

// turbo
```bash
cd /Users/mschky-air/Work/BENDERGROUP/b-content
wrangler d1 execute b-content-db --remote --file=db/schema.sql
```

> **Hinweis:** `CREATE TABLE IF NOT EXISTS` ist idempotent. Für einen vollständigen Reset vorher manuell DROPpen:

```bash
cd /Users/mschky-air/Work/BENDERGROUP/b-content
wrangler d1 execute b-content-db --remote --command="DROP TABLE IF EXISTS generated_images; DROP TABLE IF EXISTS posts;"
wrangler d1 execute b-content-db --remote --file=db/schema.sql
```

### 2. R2 Bucket leeren (Test-Bilder)

```bash
cd /Users/mschky-air/Work/BENDERGROUP/b-content
wrangler r2 object list b-content-images --jurisdiction=eu | jq -r '.[] | .key' | while read key; do
  wrangler r2 object delete b-content-images/"$key" --jurisdiction=eu
done
```

> **Alternative:** Im Cloudflare Dashboard → R2 → `b-content-images` → alle Objekte löschen.

### 3. KV Store prüfen (optional)

Nur nötig wenn manuell Knowledge-Übersteuerungen angelegt wurden:

```bash
cd /Users/mschky-air/Work/BENDERGROUP/b-content
wrangler kv key list --binding=KB_STORE
```

Falls Einträge vorhanden:

```bash
wrangler kv key list --binding=KB_STORE | jq -r '.[].name' | while read key; do
  wrangler kv key delete --binding=KB_STORE "$key"
done
```

### 4. Verifizieren

// turbo
```bash
cd /Users/mschky-air/Work/BENDERGROUP/b-content
curl -s https://b-content.maschkeai.workers.dev/api/posts | jq '.total'
# Erwartung: 0
curl -s https://b-content.maschkeai.workers.dev/api/health | jq '.schema.ok'
# Erwartung: true
```

## Checkliste

- [ ] D1: posts Tabelle leer
- [ ] D1: generated_images Tabelle leer
- [ ] R2: b-content-images Bucket leer
- [ ] KV: KB_STORE keine Custom-Einträge
- [ ] Live-URL erreichbar und funktional
- [ ] Ein Test-Post generieren → funktioniert
