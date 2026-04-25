import { BudgetBand, Timeline } from './types';

const budgetMap: Record<BudgetBand, number> = {
  'Under £2k': 1500,
  '£2k–£4k': 3000,
  '£4k–£7k': 5500,
  '£7k+': 8000
};

export function scoreLead(input: {
  inServiceArea: boolean;
  budget: BudgetBand;
  timeline: Timeline;
  photosCount: number;
  areaM2: number;
  estimateMin: number;
  minJobValue: number;
  allowBrowsing: boolean;
}) {
  if (!input.inServiceArea) return { score: 'Poor fit' as const, reason: 'Outside service area' };
  if (!input.allowBrowsing && input.timeline === 'Just browsing') return { score: 'Poor fit' as const, reason: 'Browsing-only lead disabled' };
  if (budgetMap[input.budget] < input.minJobValue) return { score: 'Poor fit' as const, reason: 'Budget appears below minimum job value' };
  if (input.timeline === 'Just browsing' || input.areaM2 < 10 || input.estimateMin < input.minJobValue) return { score: 'Poor fit' as const, reason: 'Low urgency or too small for minimum viable job' };

  if ((input.timeline === 'Urgent' || input.timeline === 'Within 30 days') && input.photosCount > 0) {
    return { score: 'Hot' as const, reason: 'In area, good urgency, budget acceptable, and photos uploaded' };
  }

  return { score: 'Warm' as const, reason: 'Potentially viable but missing urgency or photo proof' };
}
