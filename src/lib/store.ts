'use client';
import { create } from 'zustand';
import { DiagnosisResponse } from '@/types';

interface AppState {
  photoBlob?: Blob;
  photoURL?: string;
  diagnosis?: DiagnosisResponse;
  setPhoto: (b?: Blob, url?: string) => void;
  setDiagnosis: (d?: DiagnosisResponse) => void;
}

export const useAppStore = create<AppState>((set) => ({
  photoBlob: undefined,
  photoURL: undefined,
  diagnosis: undefined,
  setPhoto: (b, url) => set({ photoBlob: b, photoURL: url }),
  setDiagnosis: (d) => set({ diagnosis: d })
}));
