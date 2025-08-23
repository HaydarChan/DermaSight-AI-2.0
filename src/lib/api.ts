import { BookingRequest, BookingResponse, DiagnosisResponse, Hospital, Severity } from '@/types';

// ⚠️ Set your FastAPI base URL here
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export async function diagnoseSkin(image: Blob): Promise<DiagnosisResponse> {
  const form = new FormData();
  form.append('image', new File([image], 'skin.jpg', { type: 'image/jpeg' }));

  const res = await fetch(`${API_BASE_URL}/api/v1/diagnose`, {
    method: 'POST',
    body: form,
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) throw new Error(`Diagnose failed: ${res.status}`);
  return res.json();
}

export async function findHospitals(params: {
  lat: number; lng: number; conditionCode?: string; radiusKm?: number; severity?: Severity;
}): Promise<Hospital[]> {
  const q = new URLSearchParams({
    lat: String(params.lat),
    lng: String(params.lng),
    ...(params.conditionCode ? { condition: params.conditionCode } : {}),
    ...(params.radiusKm ? { radius_km: String(params.radiusKm) } : {})
  });
  const res = await fetch(`${API_BASE_URL}/api/v1/hospitals?${q.toString()}`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Hospitals failed: ${res.status}`);
  return res.json();
}

export async function createBooking(body: BookingRequest): Promise<BookingResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Booking failed: ${res.status}`);
  return res.json();
}
