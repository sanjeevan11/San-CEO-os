import { useMemo, useState } from 'react';
import { areaFromInput, estimateBudget } from '../lib/pricing';
import { scoreLead } from '../lib/scoring';
import { getPricing, getLeads, incrementMetric, saveLeads } from '../lib/storage';
import { Lead } from '../lib/types';

const jobs = ['Resin driveway','Block paving','Tarmac driveway','Patio','Garden redesign'];
const surfaces = ['Grass / soil','Old tarmac','Old concrete','Existing blocks','Uneven / needs excavation'];
const access = ['Easy access','Narrow access','Steep slope','Skip placement issue'];
const budgets = ['Under £2k','£2k–£4k','£4k–£7k','£7k+'] as const;
const timelines = ['Urgent','Within 30 days','Within 3 months','Just browsing'] as const;

export default function DemoQuote() {
  const pricing = getPricing()!;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<any>({ jobType: jobs[0], currentSurface: surfaces[0], access: access[0], budget: budgets[1], timeline: timelines[1], photos: [] as string[] });
  const [result, setResult] = useState<{ min: number; max: number; score: 'Hot'|'Warm'|'Poor fit'; reason: string; factors: string[] } | null>(null);

  const areaM2 = useMemo(() => areaFromInput(form.width ? Number(form.width) : undefined, form.length ? Number(form.length) : undefined, form.roughSize), [form.width, form.length, form.roughSize]);

  function update(key: string, value: any) { setForm((p: any) => ({ ...p, [key]: value })); }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => update('photos', [...form.photos, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }

  function submit() {
    const estimate = estimateBudget({ jobType: form.jobType, areaM2, currentSurface: form.currentSurface, access: form.access, pricing });
    const inService = pricing.servicePostcodes.split(',').map((p) => p.trim()).includes((form.postcode || '').toUpperCase().split(' ')[0]);
    const scored = scoreLead({ inServiceArea: inService, budget: form.budget, timeline: form.timeline, photosCount: form.photos.length, areaM2, estimateMin: estimate.min, minJobValue: pricing.minJobValue, allowBrowsing: pricing.allowBrowsing });

    const lead: Lead = {
      id: crypto.randomUUID(),
      name: form.name, phone: form.phone, email: form.email, postcode: form.postcode, jobType: form.jobType,
      width: form.width ? Number(form.width) : undefined, length: form.length ? Number(form.length) : undefined, roughSize: form.roughSize,
      areaM2, currentSurface: form.currentSurface, access: form.access, budget: form.budget, timeline: form.timeline,
      estimateMin: estimate.min, estimateMax: estimate.max, score: scored.score, scoreReason: scored.reason, factors: estimate.factors,
      status: 'New', notes: '', photos: form.photos, createdAt: new Date().toISOString()
    };

    saveLeads([lead, ...getLeads()]);
    incrementMetric('quoteCompletions');
    setResult({ min: estimate.min, max: estimate.max, score: scored.score, reason: scored.reason, factors: estimate.factors });
    setStep(10);
  }

  const panels: Record<number, JSX.Element> = {
    1: <select className="input" value={form.jobType} onChange={(e) => update('jobType', e.target.value)}>{jobs.map((j) => <option key={j}>{j}</option>)}</select>,
    2: <div className="space-y-2"><div className="grid grid-cols-2 gap-2"><input className="input" type="number" placeholder="Width m" onChange={(e)=>update('width',e.target.value)} /><input className="input" type="number" placeholder="Length m" onChange={(e)=>update('length',e.target.value)} /></div><select className="input" value={form.roughSize || ''} onChange={(e)=>update('roughSize', e.target.value || undefined)}><option value="">I know exact size</option><option>Small</option><option>Medium</option><option>Large</option></select><p className="text-sm">Area: {areaM2.toFixed(1)}m²</p></div>,
    3: <select className="input" value={form.currentSurface} onChange={(e)=>update('currentSurface', e.target.value)}>{surfaces.map((x)=><option key={x}>{x}</option>)}</select>,
    4: <select className="input" value={form.access} onChange={(e)=>update('access', e.target.value)}>{access.map((x)=><option key={x}>{x}</option>)}</select>,
    5: <select className="input" value={form.budget} onChange={(e)=>update('budget', e.target.value)}>{budgets.map((x)=><option key={x}>{x}</option>)}</select>,
    6: <select className="input" value={form.timeline} onChange={(e)=>update('timeline', e.target.value)}>{timelines.map((x)=><option key={x}>{x}</option>)}</select>,
    7: <input className="input" placeholder="Postcode" onChange={(e)=>update('postcode', e.target.value)} />, 
    8: <div><input className="input" type="file" accept="image/*" multiple onChange={handlePhoto} /><p className="text-xs text-slate-500 mt-1">Photos are stored in localStorage demo only.</p></div>,
    9: <div className="space-y-2"><input className="input" placeholder="Name" onChange={(e)=>update('name', e.target.value)} /><input className="input" placeholder="Phone" onChange={(e)=>update('phone', e.target.value)} /><input className="input" type="email" placeholder="Email" onChange={(e)=>update('email', e.target.value)} /></div>,
    10: <div className="space-y-2"><p className="text-xl font-bold">Indicative budget: £{result?.min}–£{result?.max}</p><p className="badge bg-slate-100 text-slate-800">Lead score: {result?.score}</p><p className="text-sm">Why: {result?.reason}</p><ul className="list-disc pl-5 text-sm">{result?.factors.map((f)=><li key={f}>{f}</li>)}</ul><p className="text-xs text-slate-500">This is an indicative budget range, not a final quote. Final pricing depends on survey, access, materials, drainage, groundwork, and site condition.</p><p className="text-sm font-semibold text-emerald-700">Your quote request has been saved to the contractor dashboard demo.</p></div>
  };

  if (step===1) incrementMetric('quoteStarts');

  return (
    <section className="card space-y-3">
      <h1 className="text-xl font-bold">Homeowner Quote Demo</h1>
      <p className="text-sm text-slate-600">Step {Math.min(step,9)} of 9</p>
      {panels[step]}
      {step < 10 && (
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-secondary" disabled={step===1} onClick={()=>setStep((s)=>Math.max(1,s-1))}>Back</button>
          {step<9 ? <button className="btn-primary" onClick={()=>setStep((s)=>s+1)}>Next</button> : <button className="btn-primary" onClick={submit}>Show result</button>}
        </div>
      )}
    </section>
  );
}
