# JVC DevLog

A personal developer journal built with React, Express 5, and MySQL.

**Live site:** [https://icstarslog.nfshost.com/](https://icstarslog.nfshost.com/)

## Deploy

### Backend → NearlyFreeSpeech.NET

```bash
bash deploy-nfsn.sh
```

This builds frontend + server locally, uploads `dist/`, `dist-server/`, and `package.json` to NFSN via rsync, then runs `npm install --omit=dev` on the server. After deploy, restart the daemon in the NFSN site panel.

> **Note:** `run.sh` lives at `/home/protected/run.sh` on NFSN — it contains hardcoded env vars and is created directly on the server via SSH (not uploaded from Windows, to avoid CRLF issues).

### Frontend → GitHub Pages

```bash
npm run deploy
```

This runs `tsc -b && vite build` then publishes `dist/` via `gh-pages`.

### Windows (PowerShell)

If `bash` isn't on your PATH, use the full Git Bash path:

```powershell
& "C:\Program Files\Git\bin\bash.exe" deploy-nfsn.sh
```