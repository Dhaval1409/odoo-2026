'use client';

export default function DriversPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Driver Management</h2>
        <p className="text-sm text-slate-400">Manage driver profiles, compliance, and availability.</p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-8 text-center text-xs text-slate-500">
        Driver records will appear here.
      </div>
    </div>
  );
}
