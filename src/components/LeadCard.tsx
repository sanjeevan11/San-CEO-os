import { Lead, PricingSettings } from '../lib/types';

export default function LeadCard({ lead, settings, onStatusChange, onNotesChange }: { lead: Lead; settings: PricingSettings; onStatusChange: (id: string, status: Lead['status']) => void; onNotesChange: (id: string, notes: string) => void }) {
  const waText = `Hi ${lead.name}, thanks for requesting a ${lead.jobType} estimate through QuoteGate. Based on your details, your indicative budget range is £${lead.estimateMin}–£${lead.estimateMax}. I can confirm properly after checking your photos/site. When is a good time to call?`;
  const summary = `${lead.name} | ${lead.phone} | ${lead.postcode} | ${lead.jobType} | £${lead.estimateMin}-£${lead.estimateMax} | ${lead.score}`;

  return (
    <article className="card space-y-2">
      <div className="flex items-center justify-between"><h3 className="font-semibold">{lead.name}</h3><span className={`badge ${lead.score === 'Hot' ? 'bg-red-100 text-red-700' : lead.score === 'Warm' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}`}>{lead.score}</span></div>
      <p className="text-sm">{lead.jobType} · {lead.areaM2.toFixed(1)}m² · {lead.postcode}</p>
      <p className="text-sm">Budget {lead.budget} · {lead.timeline} · £{lead.estimateMin}-£{lead.estimateMax}</p>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <a className="btn-secondary" href={`tel:${lead.phone}`}>Call</a>
        <a className="btn-secondary" href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(waText)}`} target="_blank">WhatsApp</a>
        <a className="btn-secondary" href={`mailto:${lead.email}`}>Email</a>
      </div>
      <button className="btn-secondary w-full" onClick={() => navigator.clipboard.writeText(summary)}>Copy lead summary</button>
      <select className="input" value={lead.status} onChange={(e) => onStatusChange(lead.id, e.target.value as Lead['status'])}>
        {['New','Contacted','Quoted','Won','Lost'].map((s) => <option key={s}>{s}</option>)}
      </select>
      <textarea className="input" placeholder="Notes" value={lead.notes} onChange={(e) => onNotesChange(lead.id, e.target.value)} />
      {lead.photos.length > 0 && <div className="grid grid-cols-3 gap-2">{lead.photos.map((p, i) => <img key={i} src={p} className="h-16 w-full rounded object-cover" />)}</div>}
      <p className="text-xs text-slate-500">Created {new Date(lead.createdAt).toLocaleString('en-GB')}</p>
    </article>
  );
}
