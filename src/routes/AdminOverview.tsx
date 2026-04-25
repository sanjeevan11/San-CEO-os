import { Link } from 'react-router-dom';
import { getLeads, getMetrics } from '../lib/storage';

export default function AdminOverview() {
  const leads = getLeads();
  const metrics = getMetrics();
  const hot = leads.filter((l) => l.score === 'Hot').length;
  const won = leads.filter((l) => l.status === 'Won').length;
  const pipeline = leads.reduce((n, l) => n + l.estimateMax, 0);
  const conversion = leads.length ? Math.round((won / leads.length) * 100) : 0;

  const cards = [
    ['Total leads this month', leads.length],
    ['Hot leads', hot],
    ['Estimated pipeline value', `£${pipeline}`],
    ['Quote requests started', metrics.quoteStarts],
    ['Quote requests completed', metrics.quoteCompletions],
    ['Won jobs', won],
    ['Conversion rate', `${conversion}%`]
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">{cards.map(([k,v]) => <article key={String(k)} className="card"><p className="text-xs text-slate-500">{k}</p><p className="text-xl font-bold">{v}</p></article>)}</div>
      <section className="card">
        <h2 className="font-bold">Latest leads</h2>
        <div className="mt-2 space-y-2">{leads.slice(0,5).map((l) => <div key={l.id} className="rounded border p-2 text-sm">{l.name} · {l.jobType} · {l.score} · £{l.estimateMin}-£{l.estimateMax}</div>)}</div>
      </section>
      <div className="grid grid-cols-2 gap-2">
        <Link className="btn-secondary" to="/admin/leads">Lead inbox</Link>
        <Link className="btn-secondary" to="/admin/pricing">Pricing editor</Link>
        <Link className="btn-secondary" to="/admin/settings">Settings</Link>
        <Link className="btn-secondary" to="/admin/analytics">Analytics</Link>
      </div>
    </div>
  );
}
