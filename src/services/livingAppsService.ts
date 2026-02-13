// Auto-generated LivingApps Service

import { APP_IDS } from '@/types/app';
import type { Dozenten, Raeume, Teilnehmer, Kurse, Anmeldungen } from '@/types/app';

const API_BASE = 'https://my.living-apps.de/rest';

export function extractRecordId(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/\/records\/([^\/]+)$/);
  return match ? match[1] : null;
}

export function createRecordUrl(appId: string, recordId: string): string {
  return `${API_BASE}/apps/${appId}/records/${recordId}`;
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const LivingAppsService = {
  // Dozenten
  getDozenten: () => fetchApi<Dozenten[]>(`${API_BASE}/apps/${APP_IDS.DOZENTEN}/records`),
  createDozenten: (data: Dozenten['fields']) => fetchApi<Dozenten>(`${API_BASE}/apps/${APP_IDS.DOZENTEN}/records`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: data }) }),
  updateDozenten: (id: string, data: Partial<Dozenten['fields']>) => fetchApi<Dozenten>(`${API_BASE}/apps/${APP_IDS.DOZENTEN}/records/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: data }) }),
  deleteDozenten: (id: string) => fetchApi<void>(`${API_BASE}/apps/${APP_IDS.DOZENTEN}/records/${id}`, { method: 'DELETE' }),

  // Räume
  getRaeume: () => fetchApi<Raeume[]>(`${API_BASE}/apps/${APP_IDS.RAEUME}/records`),
  createRaeume: (data: Raeume['fields']) => fetchApi<Raeume>(`${API_BASE}/apps/${APP_IDS.RAEUME}/records`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: data }) }),
  updateRaeume: (id: string, data: Partial<Raeume['fields']>) => fetchApi<Raeume>(`${API_BASE}/apps/${APP_IDS.RAEUME}/records/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: data }) }),
  deleteRaeume: (id: string) => fetchApi<void>(`${API_BASE}/apps/${APP_IDS.RAEUME}/records/${id}`, { method: 'DELETE' }),

  // Teilnehmer
  getTeilnehmer: () => fetchApi<Teilnehmer[]>(`${API_BASE}/apps/${APP_IDS.TEILNEHMER}/records`),
  createTeilnehmer: (data: Teilnehmer['fields']) => fetchApi<Teilnehmer>(`${API_BASE}/apps/${APP_IDS.TEILNEHMER}/records`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: data }) }),
  updateTeilnehmer: (id: string, data: Partial<Teilnehmer['fields']>) => fetchApi<Teilnehmer>(`${API_BASE}/apps/${APP_IDS.TEILNEHMER}/records/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: data }) }),
  deleteTeilnehmer: (id: string) => fetchApi<void>(`${API_BASE}/apps/${APP_IDS.TEILNEHMER}/records/${id}`, { method: 'DELETE' }),

  // Kurse
  getKurse: () => fetchApi<Kurse[]>(`${API_BASE}/apps/${APP_IDS.KURSE}/records`),
  createKurse: (data: Kurse['fields']) => fetchApi<Kurse>(`${API_BASE}/apps/${APP_IDS.KURSE}/records`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: data }) }),
  updateKurse: (id: string, data: Partial<Kurse['fields']>) => fetchApi<Kurse>(`${API_BASE}/apps/${APP_IDS.KURSE}/records/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: data }) }),
  deleteKurse: (id: string) => fetchApi<void>(`${API_BASE}/apps/${APP_IDS.KURSE}/records/${id}`, { method: 'DELETE' }),

  // Anmeldungen
  getAnmeldungen: () => fetchApi<Anmeldungen[]>(`${API_BASE}/apps/${APP_IDS.ANMELDUNGEN}/records`),
  createAnmeldungen: (data: Anmeldungen['fields']) => fetchApi<Anmeldungen>(`${API_BASE}/apps/${APP_IDS.ANMELDUNGEN}/records`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: data }) }),
  updateAnmeldungen: (id: string, data: Partial<Anmeldungen['fields']>) => fetchApi<Anmeldungen>(`${API_BASE}/apps/${APP_IDS.ANMELDUNGEN}/records/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: data }) }),
  deleteAnmeldungen: (id: string) => fetchApi<void>(`${API_BASE}/apps/${APP_IDS.ANMELDUNGEN}/records/${id}`, { method: 'DELETE' }),

};
