const COLORS: Record<string, string> = {
  AVAILABLE: 'bg-signal-teal/15 text-signal-teal',
  ON_TRIP: 'bg-signal-amber/15 text-signal-amber',
  DISPATCHED: 'bg-signal-amber/15 text-signal-amber',
  IN_SHOP: 'bg-signal-slate/20 text-signal-slate',
  OFF_DUTY: 'bg-signal-slate/20 text-signal-slate',
  RETIRED: 'bg-signal-red/15 text-signal-red',
  SUSPENDED: 'bg-signal-red/15 text-signal-red',
  CANCELLED: 'bg-signal-red/15 text-signal-red',
  COMPLETED: 'bg-signal-teal/15 text-signal-teal',
  DRAFT: 'bg-signal-slate/20 text-signal-slate',
};

export default function StatusBadge({ status }: { status: string }) {
  const color = COLORS[status] || 'bg-signal-slate/20 text-signal-slate';
  return <span className={`status-pill ${color}`}>{status.replace('_', ' ')}</span>;
}
