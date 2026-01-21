# Switch App - Frontend

React app for Switch - Ghar ke paas job, 24 hours mein.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

Create `.env.production` file:

```
VITE_API_BASE_URL=https://your-backend-api.com
```

Replace `your-backend-api.com` with your actual backend API URL.

## Deploy to Netlify

1. Push this repo to GitHub
2. Go to Netlify → Add new site → Import from Git
3. Select this repository
4. Build settings:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
5. Add environment variable:
   - `VITE_API_BASE_URL` = Your backend API URL
6. Deploy!

