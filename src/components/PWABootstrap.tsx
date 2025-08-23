'use client';
import React from 'react';

export default function PWABootstrap() {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Only register in production builds; comment out if testing locally
      const isLocalhost = ['localhost', '127.0.0.1'].includes(location.hostname);
      if (process.env.NODE_ENV === 'production' || isLocalhost) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      }
    }
  }, []);
  return null;
}
