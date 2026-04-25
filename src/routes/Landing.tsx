import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="space-y-4">
      <section className="card bg-slate-900 text-white">
        <h1 className="text-3xl font-bold">Stop wasting site visits on low-budget enquiries.</h1>
        <p className="mt-2 text-slate-200">QuoteGate gives homeowners an instant budget range, collects photos, checks budget and timeline, then gives you a ready-to-call lead pack.</p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link to="/demo" className="btn-primary bg-white text-slate-900">Try the demo</Link>
          <Link to="/admin" className="btn-secondary bg-slate-800 text-white border-slate-700">Open contractor dashboard</Link>
        </div>
      </section>
      {['Problem','How it works','What the homeowner sees','What the contractor gets','Pricing','FAQ','Demo widget preview'].map((title) => (
        <section key={title} className="card">
          <h2 className="text-lg font-bold">{title}</h2>
          {title==='Problem' ? <p className="mt-2 text-sm text-slate-600">Tradespeople waste evenings and fuel visiting people who have no budget, no photos, vague job details, or are just browsing. QuoteGate filters those enquiries before the contractor drives out.</p> : null}
          {title==='Pricing' ? <ul className="mt-2 space-y-1 text-sm"><li>Founding Contractor: £49/month</li><li>Starter: £99/month</li><li>Pro: £149/month</li></ul> : null}
          {title==='Demo widget preview' ? <pre className="mt-2 rounded bg-slate-100 p-2 text-xs">{`<iframe src="YOUR_QUOTEGATE_URL/#/demo" width="100%" height="760"></iframe>`}</pre> : null}
          {!['Problem','Pricing','Demo widget preview'].includes(title) && <p className="mt-2 text-sm text-slate-600">Clear, mobile-first quote capture and lead qualification designed for driveway and landscaping contractors.</p>}
        </section>
      ))}
    </div>
  );
}
