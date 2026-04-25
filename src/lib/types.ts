export type JobType = 'Resin driveway' | 'Block paving' | 'Tarmac driveway' | 'Patio' | 'Garden redesign';
export type BudgetBand = 'Under £2k' | '£2k–£4k' | '£4k–£7k' | '£7k+';
export type Timeline = 'Urgent' | 'Within 30 days' | 'Within 3 months' | 'Just browsing';

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  postcode: string;
  jobType: JobType;
  width?: number;
  length?: number;
  roughSize?: 'Small' | 'Medium' | 'Large';
  areaM2: number;
  currentSurface: string;
  access: string;
  budget: BudgetBand;
  timeline: Timeline;
  estimateMin: number;
  estimateMax: number;
  score: 'Hot' | 'Warm' | 'Poor fit';
  scoreReason: string;
  factors: string[];
  status: 'New' | 'Contacted' | 'Quoted' | 'Won' | 'Lost';
  notes: string;
  photos: string[];
  createdAt: string;
};

export type PricingSettings = {
  minJobValue: number;
  servicePostcodes: string;
  companyName: string;
  phone: string;
  email: string;
  whatsapp: string;
  brandColor: string;
  showPriceRange: boolean;
  requirePhoto: boolean;
  allowBrowsing: boolean;
  rules: Record<string, { min: number; max: number; upliftMin: number; upliftMax: number }>;
  drainageMin: number;
  drainageMax: number;
};

export type Metrics = {
  quoteStarts: number;
  quoteCompletions: number;
};
