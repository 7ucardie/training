# Spier & Sport

Dashboard en trainingslogboek, gehost op Vercel (training.evandervecht.nl).

- `index.html` — dashboard (weekplan, programma, voeding, supplementen, bronnen)
- `logboek.html` — logboek met wachtwoord; opslag via `api/log.js` in Vercel Blob
- `*.json` — de data achter de dashboardtabellen

## Instellen in Vercel
1. Storage → Blob store (privé) aanmaken en aan dit project koppelen (zet `BLOB_READ_WRITE_TOKEN`).
2. Environment variable `LOG_PIN` = het wachtwoord voor het logboek.
3. Domain `training.evandervecht.nl` toevoegen; DNS: CNAME `training` → `cname.vercel-dns.com`.
