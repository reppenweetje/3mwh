# Deployment — leads.repp.nl

## Eerste keer deployen

### 1. GitHub repo aanmaken
```bash
cd /Users/flip/lead-dashboard
git init
git add .
git commit -m "Initial commit"
# Maak een nieuwe repo aan op github.com, dan:
git remote add origin https://github.com/JOUW_NAAM/lead-dashboard.git
git push -u origin main
```

### 2. Vercel koppelen
1. Ga naar [vercel.com](https://vercel.com) en log in
2. Klik op **Add New → Project**
3. Importeer je GitHub repo
4. Klik op **Deploy** (Vercel detecteert Next.js automatisch)

### 3. Environment variables instellen
In het Vercel dashboard → je project → **Settings → Environment Variables**:

| Naam | Waarde |
|---|---|
| `DASHBOARD_USERNAME` | jouw gebruikersnaam |
| `DASHBOARD_PASSWORD` | een sterk wachtwoord |
| `JWT_SECRET` | output van `openssl rand -base64 32` |

### 4. Subdomein leads.repp.nl instellen
1. In Vercel: **Settings → Domains → Add Domain**
2. Voer in: `leads.repp.nl`
3. Vercel geeft je een CNAME-waarde, bijv: `cname.vercel-dns.com`
4. In je DNS-beheer van repp.nl (bij je registrar/hosting):
   - Voeg toe: `CNAME leads → cname.vercel-dns.com`
5. Klaar — propagatie duurt 5–30 minuten

---

## Excel bijwerken
1. Vervang `public/data/inschrijvingen.xlsx` met het nieuwe bestand
2. `git add public/data/inschrijvingen.xlsx`
3. `git commit -m "Update Excel data"`
4. `git push` → Vercel deploy automatisch

## Documenten per lead koppelen
Voeg een kolom **"Documents Bundle URL"** toe aan het Excelbestand.
Vul per lead de Google Drive-maplink of ZIP-downloadlink in.
De downloadknop verschijnt automatisch zodra de cel gevuld is.
