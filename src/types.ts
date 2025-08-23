export type Severity = 'mild' | 'moderate' | 'severe';

export interface ConditionProb {
  label: string;
  icd10?: string;
  confidence: number; // 0..1
}

export interface DiagnosisResponse {
  topCondition: ConditionProb;
  conditions: ConditionProb[];
  severity: Severity;
  preMedication: string[];
  advice?: string;
}

export interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  equipments: string[];
  specialties: string[];
  qualifiedFor: string[];
  phone?: string;
  address?: string;
}

export interface BookingRequest {
  hospitalId: string;
  conditionCode?: string;
  patientName: string;
  phone: string;
  notes?: string;
  preferredAt?: string; // ISO string
}

export interface BookingResponse {
  bookingId: string;
  status: 'pending' | 'confirmed' | 'rejected';
  estimatedWaitMin?: number;
}
