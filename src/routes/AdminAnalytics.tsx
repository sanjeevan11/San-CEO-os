import { getLeads, getMetrics } from '../lib/storage';

export default function AdminAnalytics() {
  const leads = getLeads();
  const metrics = getMetrics();
  const byScore = ['Hot','Warm','Poor fit'].map((s)=>({label:s,value:leads.filter((l)=>l.score===s).length}));
  const byJob = Array.from(new Set(leads.map((l)=>l.jobType))).map((j)=>({label:j,value:leads.filter((l)=>l.jobType===j).length}));
  const won = leads.filter((l)=>l.status==='Won').length;
  const lost = leads.filter((l)=>l.status==='Lost').length;
  const pipeline = leads.reduce((n,l)=>n+l.estimateMax,0);

  return (
    <div className="space-y-3">
      {[['Pipeline value',`£${pipeline}`],['Won/Lost',`${won}/${lost}`],['Quote completions',metrics.quoteCompletions],['Estimated monthly value',`£${Math.round(pipeline/Math.max(leads.length,1)*4)}`]].map(([k,v])=><div key={String(k)} className="card"><p className="text-xs text-slate-500">{k}</p><p className="text-xl font-bold">{v}</p></div>)}
      <div className="card"><h2 className="font-bold">Leads by score</h2>{byScore.map((x)=><div key={x.label} className="mt-2"><div className="flex justify-between text-sm"><span>{x.label}</span><span>{x.value}</span></div><div className="h-2 rounded bg-slate-200"><div className="h-2 rounded bg-slate-800" style={{width:`${Math.min(100,x.value*20)}%`}} /></div></div>)}</div>
      <div className="card"><h2 className="font-bold">Leads by job type</h2>{byJob.map((x)=><div key={x.label} className="mt-2"><div className="flex justify-between text-sm"><span>{x.label}</span><span>{x.value}</span></div><div className="h-2 rounded bg-slate-200"><div className="h-2 rounded bg-emerald-600" style={{width:`${Math.min(100,x.value*20)}%`}} /></div></div>)}</div>
    </div>
  );
}
