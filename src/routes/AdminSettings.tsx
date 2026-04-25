import { useState } from 'react';
import { getPricing, savePricing } from '../lib/storage';

export default function AdminSettings() {
  const [s, setS] = useState(getPricing()!);
  return (
    <section className="card space-y-2">
      <h1 className="text-xl font-bold">Settings</h1>
      <input className="input" value={s.companyName} onChange={(e)=>setS({...s,companyName:e.target.value})} placeholder="Company name" />
      <input className="input" value={s.phone} onChange={(e)=>setS({...s,phone:e.target.value})} placeholder="Phone" />
      <input className="input" value={s.email} onChange={(e)=>setS({...s,email:e.target.value})} placeholder="Email" />
      <input className="input" value={s.whatsapp} onChange={(e)=>setS({...s,whatsapp:e.target.value})} placeholder="WhatsApp" />
      <input className="input" value={s.brandColor} onChange={(e)=>setS({...s,brandColor:e.target.value})} placeholder="Brand colour" />
      <label className="text-sm"><input type="checkbox" checked={s.showPriceRange} onChange={(e)=>setS({...s,showPriceRange:e.target.checked})} /> Show price range to homeowner</label>
      <label className="text-sm"><input type="checkbox" checked={s.requirePhoto} onChange={(e)=>setS({...s,requirePhoto:e.target.checked})} /> Require photo upload</label>
      <label className="text-sm"><input type="checkbox" checked={s.allowBrowsing} onChange={(e)=>setS({...s,allowBrowsing:e.target.checked})} /> Allow just browsing leads</label>
      <button className="btn-primary" onClick={()=>savePricing(s)}>Save settings</button>
    </section>
  );
}
