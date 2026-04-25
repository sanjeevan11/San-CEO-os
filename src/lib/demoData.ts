import { saveLeads, savePricing, getLeads, getPricing, saveMetrics } from './storage';
import { Lead, PricingSettings } from './types';

export const defaultPricing: PricingSettings = {
  minJobValue: 2500,
  servicePostcodes: 'B1,B2,B3,B4,B5,B11,B12,B13,B14,B15,B16,B17,B18,B19,B20,B21,B28,B29,B30,B31',
  companyName: 'Birmingham Driveway Pros',
  phone: '0121 555 1234',
  email: 'demo@quotegate.local',
  whatsapp: '447700900123',
  brandColor: '#111827',
  showPriceRange: true,
  requirePhoto: false,
  allowBrowsing: true,
  drainageMin: 300,
  drainageMax: 1000,
  rules: {
    'Resin driveway': { min: 85, max: 120, upliftMin: 20, upliftMax: 40 },
    'Block paving': { min: 90, max: 150, upliftMin: 10, upliftMax: 25 },
    'Tarmac driveway': { min: 55, max: 90, upliftMin: 10, upliftMax: 25 },
    Patio: { min: 80, max: 140, upliftMin: 15, upliftMax: 35 },
    'Garden redesign': { min: 100, max: 200, upliftMin: 25, upliftMax: 50 }
  }
};

const seedLeads: Lead[] = [
  ['Raj Singh','Resin driveway','B15 2TT','Hot','Urgent',6400,8700,'Won'],
  ['Emily Carter','Patio','B31 1HG','Warm','Within 3 months',3400,5200,'Quoted'],
  ['Tom Riley','Tarmac driveway','B2 4QA','Hot','Within 30 days',4200,6900,'Contacted'],
  ['Sophie Khan','Block paving','B18 6NN','Warm','Within 3 months',3100,5400,'New'],
  ['Nina Patel','Garden redesign','B30 2AJ','Poor fit','Just browsing',2500,4100,'Lost'],
  ['Mark Evans','Resin driveway','CV1 4AB','Poor fit','Within 30 days',2600,3900,'Lost'],
  ['Olivia Jones','Patio','B11 3LT','Hot','Within 30 days',4500,7200,'Won'],
  ['David Moss','Block paving','B21 0AA','Warm','Within 3 months',3800,6400,'Quoted']
].map((row, i) => ({
  id: `seed-${i}`,
  name: row[0], phone: '07123 456789', email: `${row[0].split(' ')[0].toLowerCase()}@mail.com`, postcode: row[2],
  jobType: row[1] as any, areaM2: 42, currentSurface: 'Old tarmac', access: 'Easy access', budget: '£4k–£7k' as any,
  timeline: row[4] as any, estimateMin: row[5] as number, estimateMax: row[6] as number,
  score: row[3] as any, scoreReason: 'Seed demo lead', factors: ['Demo seeded'], status: row[7] as any, notes: '', photos: [], createdAt: new Date().toISOString()
}));

export function seedDemoData() {
  if (!getPricing()) savePricing(defaultPricing);
  if (getLeads().length === 0) saveLeads(seedLeads);
  if (!localStorage.getItem('qg_metrics')) saveMetrics({ quoteStarts: 12, quoteCompletions: 8 });
}
