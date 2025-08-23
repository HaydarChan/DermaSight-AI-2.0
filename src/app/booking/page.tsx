'use client';
import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBooking } from '@/lib/api';
import { useAppStore } from '@/lib/store';

function BookingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const hospitalId = params.get('hospitalId') || '';
  const diag = useAppStore(s => s.diagnosis);

  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [notes, setNotes] = React.useState(diag ? diag.topCondition.label : '');
  const [busy, setBusy] = React.useState(false);

  const submit = async () => {
    try {
      setBusy(true);
      const res = await createBooking({
        hospitalId,
        conditionCode: diag?.topCondition.icd10,
        patientName: name,
        phone,
        notes
      });
      alert(`Booking created\nID: ${res.bookingId}\nStatus: ${res.status}`);
      router.push('/');
    } catch (e: any) {
      alert(e.message || 'Booking failed');
    } finally { setBusy(false); }
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h1>Book Checkup</h1>
      <label>Hospital ID<input value={hospitalId} disabled style={input} /></label>
      <label>Full name<input value={name} onChange={e => setName(e.target.value)} style={input} /></label>
      <label>Phone<input value={phone} onChange={e => setPhone(e.target.value)} style={input} /></label>
      <label>Notes<textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ ...input, height: 100 }} /></label>
      <button style={btn} disabled={busy || !name || !phone} onClick={submit}>{busy ? 'Submitting…' : 'Submit booking'}</button>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingForm />
    </Suspense>
  );
}

const input: React.CSSProperties = { width: '100%', padding: 10, borderRadius: 10, border: '1px solid #e3e3e3', display: 'block', marginTop: 4 };
const btn: React.CSSProperties = { background: '#1366d6', color: '#fff', padding: '12px 16px', border: 0, borderRadius: 12, fontWeight: 800 };
