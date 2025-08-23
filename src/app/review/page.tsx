'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { diagnoseSkin } from '@/lib/api';

export default function ReviewPage() {
  const router = useRouter();
  const { photoBlob, photoURL, setDiagnosis } = useAppStore(s => ({
    photoBlob: s.photoBlob,
    photoURL: s.photoURL,
    setDiagnosis: s.setDiagnosis
  }));
  const [busy, setBusy] = React.useState(false);

  if (!photoBlob || !photoURL) return <p>No photo. <a href="/">Go back</a></p>;

  const analyze = async () => {
    try {
      setBusy(true);
      const d = await diagnoseSkin(photoBlob);
      setDiagnosis(d);
      router.replace('/result');
    } catch (e: any) {
      alert(e.message || 'Upload failed');
    } finally { setBusy(false); }
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h1>Review & Upload</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photoURL} alt="preview" style={{ maxWidth: '100%', borderRadius: 12 }} />
      <div style={{ display: 'flex', gap: 12 }}>
        <a href="/" style={btnGray}>Retake</a>
        <button onClick={analyze} disabled={busy} style={btn}>{busy ? 'Analyzing…' : 'Analyze'}</button>
      </div>
    </div>
  );
}

const btn: React.CSSProperties = { background: '#1366d6', color: '#fff', padding: '12px 16px', border: 0, borderRadius: 12, fontWeight: 800 };
const btnGray: React.CSSProperties = { background: '#777', color: '#fff', padding: '12px 16px', borderRadius: 12, textDecoration: 'none', display: 'inline-block' };
