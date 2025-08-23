'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Camera from '@/components/Camera';
import { useAppStore } from '@/lib/store';

export default function ScanPage() {
  const router = useRouter();
  const setPhoto = useAppStore(s => s.setPhoto);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h1>Scan Skin</h1>
      <Camera onCapture={(blob, url) => { setPhoto(blob, url); router.push('/review'); }} />
      <p style={{ color: '#666' }}>Tips: Good lighting, fill frame with affected area, avoid glare.</p>
    </div>
  );
}
