'use client';
import React from 'react';

export default function ImagePicker({
  onPick
}: {
  onPick: (blob: Blob, objectUrl: string) => void
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const maxSizeMb = 20;

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('File harus bertipe gambar (JPEG/PNG/HEIC/WebP).');
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Ukuran maksimum ${maxSizeMb} MB.`);
      return;
    }

    setBusy(true);
    try {
      // langsung pakai file (Blob) tanpa re-encode; URL utk preview/next step
      const url = URL.createObjectURL(file);
      onPick(file, url);
    } finally {
      setBusy(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    // reset agar bisa pilih file yang sama dua kali
    e.currentTarget.value = '';
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          border: '2px dashed #c9ced6',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? '#f5f8ff' : '#fafafa',
          transition: 'background 120ms ease'
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Drop image here</div>
        <div style={{ color: '#666' }}>or click to choose from device</div>
        <div style={{ marginTop: 10, fontSize: 12, color: '#888' }}>
          Accept: JPG, PNG, HEIC, WebP — max {maxSizeMb}MB
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            background: '#1366d6',
            color: '#fff',
            padding: '10px 14px',
            border: 0,
            borderRadius: 10,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Browse image…
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        // capture membantu mobile membuka kamera, tapi tetap bisa pilih galeri
        capture="environment"
        onChange={onChange}
        hidden
      />

      {busy && <p>Loading image…</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </div>
  );
}
