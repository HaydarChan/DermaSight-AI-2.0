import type { Metadata, Viewport } from 'next';
import React from 'react';
import PWABootstrap from '@/components/PWABootstrap';

export const metadata: Metadata = {
  title: 'SkinScan',
  description: 'AI-assisted skin screening PWA',
  manifest: '/manifest.webmanifest'
};

export const viewport: Viewport = {
  themeColor: '#1366d6'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <PWABootstrap />
        <header style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
          <strong>SkinScan</strong>
        </header>
        <main style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>{children}</main>
      </body>
    </html>
  );
}
