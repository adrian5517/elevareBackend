# Elevare Backend (scaffold)

This is a minimal scaffold of the Elevare Intelligence backend based on the implementation guide.

Quick start (Windows PowerShell):

```powershell
# 1. Install dependencies
npm install

# 2. Copy .env.example to .env and fill values (MONGODB_URI, JWT_SECRET etc.)
cp .env.example .env; notepad .env

# 3. Start in development
npm run dev
```

If you prefer to provide connection values here, share MONGODB_URI and JWT_SECRET; otherwise fill them in `.env` before running.
