export default function BuildBadge() {
  return (
    <div className="fixed bottom-24 right-3 z-20 rounded-lg bg-slate-900/95 px-3 py-2 text-[11px] text-white shadow-lg">
      <p className="font-semibold">QuoteGate PWA v1</p>
      <p className="font-semibold text-emerald-300">LIVE DEPLOYMENT CHECK</p>
      <p>Commit: {__BUILD_HASH__}</p>
      <p className="text-[10px] text-slate-200">Old app should not appear</p>
    </div>
  );
}
