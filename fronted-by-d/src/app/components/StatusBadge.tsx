'use client';

type StatusConfig = {
  container: string;
  dot: string;
  label: string;
};

const STATUS_MAP: Record<string, StatusConfig> = {
  AVAILABLE: {
    container: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]',
    label: 'Available'
  },
  COMPLETED: {
    container: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]',
    label: 'Completed'
  },
  ON_TRIP: {
    container: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    dot: 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]',
    label: 'On Trip'
  },
  DISPATCHED: {
    container: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    dot: 'bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.5)]',
    label: 'Dispatched'
  },
  IN_SHOP: {
    container: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    dot: 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]',
    label: 'In Shop'
  },
  OFF_DUTY: {
    container: 'bg-slate-500/10 border-slate-800 text-slate-450',
    dot: 'bg-slate-500',
    label: 'Off Duty'
  },
  DRAFT: {
    container: 'bg-slate-500/5 border-slate-900 text-slate-500',
    dot: 'bg-slate-600',
    label: 'Draft'
  },
  RETIRED: {
    container: 'bg-red-500/10 border-red-500/20 text-red-400',
    dot: 'bg-red-500',
    label: 'Retired'
  },
  SUSPENDED: {
    container: 'bg-red-500/10 border-red-500/20 text-red-400',
    dot: 'bg-red-500 animate-pulse',
    label: 'Suspended'
  },
  CANCELLED: {
    container: 'bg-rose-950/30 border-rose-900/40 text-rose-500/80 lines-through',
    dot: 'bg-rose-900',
    label: 'Cancelled'
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] || {
    container: 'bg-slate-500/10 border-slate-800 text-slate-400',
    dot: 'bg-slate-400',
    label: status.replace('_', ' ')
  };

  return (
    <span className={`inline-flex items-center space-x-1.5 font-mono text-[10px] font-bold tracking-wider px-2.5 py-1 border rounded-full uppercase select-none ${config.container}`}>
      <span className={`w-1 h-1 rounded-full shrink-0 ${config.dot}`} />
      <span className="leading-none">{config.label}</span>
    </span>
  );
}