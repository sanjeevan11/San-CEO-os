import { useState } from 'react';
import LeadCard from '../components/LeadCard';
import { getLeads, getPricing, saveLeads } from '../lib/storage';
import { Lead } from '../lib/types';

export default function AdminLeads() {
  const [leads, setLeads] = useState(getLeads());
  const pricing = getPricing()!;

  const update = (fn: (lead: Lead) => Lead, id: string) => {
    const updated = leads.map((l) => (l.id === id ? fn(l) : l));
    setLeads(updated);
    saveLeads(updated);
  };

  return <div className="space-y-3">{leads.length===0 ? <div className="card text-sm">No leads yet. Complete a quote in Demo.</div> : leads.map((l)=><LeadCard key={l.id} lead={l} settings={pricing} onStatusChange={(id,status)=>update((lead)=>({...lead,status}),id)} onNotesChange={(id,notes)=>update((lead)=>({...lead,notes}),id)} />)}</div>;
}
