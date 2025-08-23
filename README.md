# SkinScan PWA

> ⚠️ Disclaimer: This provides AI-assisted screening and general pre‑medication guidance. It is **not** a medical diagnosis. Always consult a licensed clinician.

## Quickstart

```bash
npm install
npm run dev
```

## Environment Setup

Create a `.env.local` file and set your FastAPI base URL:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## PWA Icons

Place your PWA icons in `public/icons/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

## Features

- Camera capture for skin photos
- AI diagnosis with severity assessment
- Pre-medication recommendations
- Hospital finder with geolocation
- Booking system for appointments

## Architecture

- **Frontend**: Next.js 14 with TypeScript
- **State Management**: Zustand
- **PWA**: Service Worker + Web Manifest
- **Styling**: Inline CSS (no external dependencies)
- **Backend**: FastAPI (separate service)

## Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## HTTPS Requirements

Camera and geolocation APIs require HTTPS in production. Localhost is allowed for development.
