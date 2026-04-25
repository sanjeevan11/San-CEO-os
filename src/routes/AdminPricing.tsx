import { useState } from 'react';
import { getPricing, savePricing } from '../lib/storage';

export default function AdminPricing() {
  const [pricing, setPricing] = useState(getPricing()!);
  const jobs = Object.keys(pricing.rules);

  return (
    <section className="card space-y-3">
      <h1 className="text-xl font-bold">Pricing editor</h1>
      <input className="input" value={pricing.minJobValue} type="number" onChange={(e)=>setPricing({...pricing,minJobValue:Number(e.target.value)})} />
      <input className="input" value={pricing.servicePostcodes} onChange={(e)=>setPricing({...pricing,servicePostcodes:e.target.value})} />
      {jobs.map((job)=><div key={job} className="rounded border p-2 space-y-1"><p className="font-semibold">{job}</p><div className="grid grid-cols-2 gap-2"><input className="input" type="number" value={pricing.rules[job].min} onChange={(e)=>setPricing({...pricing,rules:{...pricing.rules,[job]:{...pricing.rules[job],min:Number(e.target.value)}}})}/><input className="input" type="number" value={pricing.rules[job].max} onChange={(e)=>setPricing({...pricing,rules:{...pricing.rules,[job]:{...pricing.rules[job],max:Number(e.target.value)}}})}/></div></div>)}
      <button className="btn-primary" onClick={()=>savePricing(pricing)}>Save pricing</button>
    </section>
  );
}
