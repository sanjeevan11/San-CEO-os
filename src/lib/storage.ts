import { Lead, Metrics, PricingSettings } from './types';

const KEYS = {
  leads: 'qg_leads',
  pricing: 'qg_pricing',
  metrics: 'qg_metrics',
  slug: 'qg_slug'
};

export function getLeads(): Lead[] {
  return JSON.parse(localStorage.getItem(KEYS.leads) || '[]');
}

export function saveLeads(leads: Lead[]) {
  localStorage.setItem(KEYS.leads, JSON.stringify(leads));
}

export function getPricing(): PricingSettings | null {
  return JSON.parse(localStorage.getItem(KEYS.pricing) || 'null');
}

export function savePricing(settings: PricingSettings) {
  localStorage.setItem(KEYS.pricing, JSON.stringify(settings));
}

export function getMetrics(): Metrics {
  return JSON.parse(localStorage.getItem(KEYS.metrics) || '{"quoteStarts":0,"quoteCompletions":0}');
}

export function saveMetrics(metrics: Metrics) {
  localStorage.setItem(KEYS.metrics, JSON.stringify(metrics));
}

export function incrementMetric(key: keyof Metrics) {
  const m = getMetrics();
  m[key] += 1;
  saveMetrics(m);
}

export function exportAllData() {
  return {
    leads: getLeads(),
    pricing: getPricing(),
    metrics: getMetrics(),
    slug: localStorage.getItem(KEYS.slug) || 'birmingham-driveway-pros'
  };
}

export function importAllData(payload: unknown) {
  const parsed = payload as { leads?: Lead[]; pricing?: PricingSettings; metrics?: Metrics; slug?: string };
  if (parsed.leads) saveLeads(parsed.leads);
  if (parsed.pricing) savePricing(parsed.pricing);
  if (parsed.metrics) saveMetrics(parsed.metrics);
  if (parsed.slug) localStorage.setItem(KEYS.slug, parsed.slug);
}

export function clearAllDemoData() {
  localStorage.removeItem(KEYS.leads);
  localStorage.removeItem(KEYS.pricing);
  localStorage.removeItem(KEYS.metrics);
}
