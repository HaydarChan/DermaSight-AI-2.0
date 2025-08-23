'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { findHospitals } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import type { Hospital } from '@/types';
import { haversineKm } from '@/lib/distance';

export default function HospitalsPage() {
  const router = useRouter();
  const diag = useAppStore(s => s.diagnosis);
  const [busy, setBusy] = React.useState(true);
  const [items, setItems] = React.useState<Hospital[]>([]);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
        });
        const lat = pos.coords.latitude; const lng = pos.coords.longitude;
        const list = await findHospitals({ lat, lng, conditionCode: diag?.topCondition.icd10, radiusKm: 25 });
        const withDist = list.map(h => ({ ...h, distanceKm: haversineKm(lat, lng, h.lat, h.lng) }))
          .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
        setItems(withDist);
      } catch (e: any) {
        setErr(e?.message || 'Failed to fetch hospitals');
      } finally { setBusy(false); }
    })();
  }, [diag?.topCondition.icd10]);

  if (busy) return <p>Finding hospitals…</p>;
  if (err) return <p style={{ color: 'crimson' }}>{err}</p>;
  if (!items.length) return <p>No matching hospitals found nearby.</p>;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h1>Nearby Hospitals</h1>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map(h => (
          <li key={h.id} style={card}>
            <div style={{ display: 'grid', gap: 4 }}>
              <strong>{h.name}</strong>
              <span style={{ color: '#555' }}>{h.address}</span>
              <span>Distance: {(h.distanceKm ?? 0).toFixed(1)} km</span>
              <span style={{ color: '#555' }}>Specialties: {h.specialties.join(', ')}</span>
              <span style={{ color: '#555' }}>Equipments: {h.equipments.join(', ')}</span>
            </div>
            <div>
              <button style={btn} onClick={() => router.push(`/booking?hospitalId=${encodeURIComponent(h.id)}`)}>Book</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const btn: React.CSSProperties = { background: '#1366d6', color: '#fff', padding: '8px 12px', border: 0, borderRadius: 10, fontWeight: 800 };
const card: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 12, marginBottom: 8 };
