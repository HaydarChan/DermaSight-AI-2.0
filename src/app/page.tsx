'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Camera from '@/components/Camera';
import ImagePicker from '@/components/ImagePicker';
import { useAppStore } from '@/lib/store';

type Mode = 'camera' | 'upload';

export default function ScanPage() {
  const router = useRouter();
  const setPhoto = useAppStore(s => s.setPhoto);
  const [mode, setMode] = React.useState<Mode>('camera');

  const handleCapture = (blob: Blob, url: string) => {
    setPhoto(blob, url);
    router.push('/review');
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h1>Scan Skin</h1>

      {/* Toggle */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => setMode('camera')}
          style={{
            ...tabBtn,
            background: mode === 'camera' ? '#1366d6' : '#f2f3f5',
            color: mode === 'camera' ? '#fff' : '#111',
          }}
        >
          📷 Camera
        </button>
        <button
          onClick={() => setMode('upload')}
          style={{
            ...tabBtn,
            background: mode === 'upload' ? '#1366d6' : '#f2f3f5',
            color: mode === 'upload' ? '#fff' : '#111',
          }}
        >
          🖼️ Upload
        </button>
      </div>

      {mode === 'camera' ? (
        <Camera onCapture={handleCapture} />
      ) : (
        <ImagePicker onPick={handleCapture} />
      )}

      <p style={{ color: '#666' }}>
        Tips: Good lighting, fill frame with affected area, avoid glare.
      </p>
    </div>
  );
}

const tabBtn: React.CSSProperties = {
  border: 0,
  padding: '10px 14px',
  borderRadius: 10,
  fontWeight: 700,
  cursor: 'pointer',
};
