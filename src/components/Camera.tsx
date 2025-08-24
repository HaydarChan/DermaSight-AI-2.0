'use client';
import React from 'react';

export default function Camera({ onCapture }: { onCapture: (blob: Blob, objectUrl: string) => void }) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [facingMode, setFacingMode] = React.useState<'environment' | 'user'>('environment');
  const streamRef = React.useRef<MediaStream | null>(null);

  const initCamera = React.useCallback(async (facing: 'environment' | 'user') => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { ideal: facing } } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setReady(true);
        setError(null);
      }
    } catch (e: any) {
      setError(e?.message || 'Camera not available');
      setReady(false);
    }
  }, []);

  React.useEffect(() => {
    initCamera(facingMode);
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, [facingMode, initCamera]);

  const shoot = async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob: Blob = await new Promise((resolve) => canvas.toBlob(b => resolve(b as Blob), 'image/jpeg', 0.9)!);
    const url = URL.createObjectURL(blob);
    onCapture(blob, url);
  };

  const flipCamera = () => {
    setReady(false);
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  if (error) return <p style={{ color: 'crimson' }}>Error: {error}</p>;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ position: 'relative' }}>
        <video ref={videoRef} playsInline muted style={{ width: '100%', background: '#000', borderRadius: 12 }} />
        <button 
          onClick={flipCamera} 
          disabled={!ready}
          style={{
            ...flipBtn,
            position: 'absolute',
            top: 12,
            right: 12
          }}
        >
          🔄
        </button>
      </div>
      <button onClick={shoot} disabled={!ready} style={btn}>Capture</button>
      {!ready && <p>Initializing camera… (needs HTTPS or localhost)</p>}
    </div>
  );
}

const btn: React.CSSProperties = { background: '#1366d6', color: '#fff', padding: '12px 16px', border: 0, borderRadius: 12, fontWeight: 800 };

const flipBtn: React.CSSProperties = { 
  background: 'rgba(0, 0, 0, 0.6)', 
  color: '#fff', 
  padding: '8px', 
  border: 0, 
  borderRadius: '50%', 
  fontSize: 16,
  cursor: 'pointer',
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
