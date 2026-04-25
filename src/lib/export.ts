import { Lead } from './types';

export function leadsToCsv(leads: Lead[]) {
  const header = 'name,phone,email,postcode,jobType,areaM2,budget,timeline,estimateMin,estimateMax,score,status,createdAt';
  const rows = leads.map((l) => [l.name, l.phone, l.email, l.postcode, l.jobType, l.areaM2, l.budget, l.timeline, l.estimateMin, l.estimateMax, l.score, l.status, l.createdAt].join(','));
  return [header, ...rows].join('\n');
}

export function downloadText(filename: string, content: string, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
