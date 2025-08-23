'use client';
import React from 'react';

export default function Camera({ onCapture }: { onCapture: (blob: Blob, objectUrl: string) => void }) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let stream: MediaStream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch (e: any) {
        setError(e?.message || 'Camera not available');
      }
    })();
    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, []);

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

  if (error) return <p style={{ color: 'crimson' }}>Error: {error}</p>;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <video ref={videoRef} playsInline muted style={{ width: '100%', background: '#000', borderRadius: 12 }} />
      <button onClick={shoot} disabled={!ready} style={btn}>Capture</button>
      {!ready && <p>Initializing camera… (needs HTTPS or localhost)</p>}
    </div>
  );
}

const btn: React.CSSProperties = { background: '#1366d6', color: '#fff', padding: '12px 16px', border: 0, borderRadius: 12, fontWeight: 800 };
