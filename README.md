This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Production on Hostinger VPS (PostgreSQL)

### 1. VPS Kurulumu
```bash
# PostgreSQL kurulumu (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib nodejs npm

# Database oluşturma
sudo -u postgres createdb royal_carrelages
sudo -u postgres createuser --interactive your_username
```

### 2. Environment Variables
```bash
# .env dosyası oluşturun
DATABASE_URL="postgresql://username:password@localhost:5432/royal_carrelages"
```

### 3. Deploy
```bash
# Dosyaları VPS'e yükleyin
npm ci
npm run deploy  # migrations + seed + build
npm run start:prod
```

### 4. PM2 ile Process Management
```bash
npm install -g pm2
pm2 start npm --name "royal-carrelages" -- run start:prod
pm2 startup
pm2 save
```

### 5. Healthcheck
`GET /api/health` → `{ ok: true }`

### Alternative: Cloud Database
- **Supabase**: Ücretsiz PostgreSQL (EU region)
- **Neon**: Serverless PostgreSQL
- **Railway**: Kolay setup

```bash
# Cloud database ile
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
npm run deploy
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
