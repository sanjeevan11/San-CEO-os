import { Link, NavLink, Outlet } from 'react-router-dom';
import { onInstallAvailable, promptInstall } from '../lib/pwa';
import { useEffect, useState } from 'react';
import BuildBadge from './BuildBadge';

export default function AppShell() {
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    onInstallAvailable(setInstallable);
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-md bg-slate-50 pb-24">
      <header className="sticky top-0 z-10 border-b bg-white/95 p-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-lg font-extrabold">QuoteGate</Link>
          <span className="badge bg-amber-100 text-amber-700">Demo Mode</span>
        </div>
        {installable && <button onClick={promptInstall} className="mt-3 w-full btn-primary">Install app</button>}
      </header>
      <main className="p-4"><Outlet /></main>
      <BuildBadge />
      <nav className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t bg-white p-3">
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <NavLink to="/" className="btn-secondary">Home</NavLink>
          <NavLink to="/demo" className="btn-secondary">Demo</NavLink>
          <NavLink to="/admin" className="btn-secondary">Admin</NavLink>
        </div>
      </nav>
    </div>
  );
}
