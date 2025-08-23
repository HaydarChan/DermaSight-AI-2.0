'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

export default function ResultPage() {
  const router = useRouter();
  const d = useAppStore(s => s.diagnosis);
  if (!d) return <p>No result. <a href="/review">Back</a></p>;

  const severityColor = d.severity === 'severe' ? '#d61313' : d.severity === 'moderate' ? '#e6a80a' : '#0a9866';

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h1>Result & Advice</h1>
      <div style={{ borderLeft: `6px solid ${severityColor}`, paddingLeft: 12 }}>
        <h2 style={{ margin: 0 }}>{d.topCondition.label}{d.topCondition.icd10 ? ` (${d.topCondition.icd10})` : ''}</h2>
        <p>Severity: <strong style={{ color: severityColor }}>{d.severity.toUpperCase()}</strong></p>
        <p><strong>Pre‑medication:</strong></p>
        <ul>
          {d.preMedication.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
        {d.advice && <p style={{ fontStyle: 'italic' }}>{d.advice}</p>}
      </div>

      <section>
        <h3>Other possibilities</h3>
        <ul>
          {d.conditions.map((c, i) => (
            <li key={i}>{c.label}{c.icd10 ? ` (${c.icd10})` : ''} – {(c.confidence * 100).toFixed(1)}%</li>
          ))}
        </ul>
      </section>

      <p style={{ fontSize: 12, color: '#666' }}>This is not a diagnosis. If symptoms persist or worsen, seek professional care.</p>

      <button style={btn} onClick={() => router.push('/hospitals')}>Find qualified hospitals nearby</button>
    </div>
  );
}

const btn: React.CSSProperties = { background: '#1366d6', color: '#fff', padding: '12px 16px', border: 0, borderRadius: 12, fontWeight: 800 };
