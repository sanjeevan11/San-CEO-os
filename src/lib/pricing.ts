import { PricingSettings } from './types';

export function areaFromInput(width?: number, length?: number, roughSize?: 'Small' | 'Medium' | 'Large') {
  if (width && length) return width * length;
  if (roughSize === 'Small') return 20;
  if (roughSize === 'Medium') return 45;
  if (roughSize === 'Large') return 80;
  return 0;
}

export function estimateBudget(input: {
  jobType: string;
  areaM2: number;
  currentSurface: string;
  access: string;
  pricing: PricingSettings;
}) {
  const rule = input.pricing.rules[input.jobType];
  let min = input.areaM2 * rule.min;
  let max = input.areaM2 * rule.max;

  min += input.areaM2 * rule.upliftMin;
  max += input.areaM2 * rule.upliftMax;

  if (input.access === 'Steep slope' || input.access === 'Skip placement issue') {
    min += input.pricing.drainageMin;
    max += input.pricing.drainageMax;
  }

  min = Math.max(min, input.pricing.minJobValue);
  max = Math.max(max, input.pricing.minJobValue);

  const factors = [`Area: ${input.areaM2.toFixed(1)}m²`, `${input.currentSurface} prep`, `${input.access} access`];
  return { min: Math.round(min), max: Math.round(max), factors };
}
