import { useRef } from 'react';
import { clearAllDemoData, exportAllData, getLeads, importAllData } from '../lib/storage';
import { downloadText, leadsToCsv } from '../lib/export';

export default function AdminExport() {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <section className="card space-y-2">
      <h1 className="text-xl font-bold">Export / backup</h1>
      <button className="btn-secondary w-full" onClick={()=>downloadText('quotegate-leads.csv', leadsToCsv(getLeads()), 'text/csv')}>Export leads as CSV</button>
      <button className="btn-secondary w-full" onClick={()=>downloadText('quotegate-backup.json', JSON.stringify(exportAllData(), null, 2), 'application/json')}>Export all localStorage as JSON</button>
      <input ref={fileRef} type="file" accept="application/json" className="input" onChange={(e)=>{const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>importAllData(JSON.parse(String(r.result))); r.readAsText(f);}} />
      <button className="btn-primary w-full bg-red-600 hover:bg-red-700" onClick={()=>{ if(confirm('Clear all demo data?')) clearAllDemoData(); }}>Clear demo data</button>
    </section>
  );
}
