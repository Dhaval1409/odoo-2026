'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Real-time tracking animation mock states
  const [activeTab, setActiveTab] = useState<'all' | 'van05' | 'heavy'>('all');
  const [simulatedMetrics, setSimulatedMetrics] = useState({
    speed: 68,
    fuelPct: 84,
    lat: '23.0225° N',
    lng: '72.5714° E',
    progress: 42
  });

  // Creative section state controls
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(1);
  const [activePersona, setActivePersona] = useState('manager');

  useEffect(() => {
    setMounted(true);
    
    const interval = setInterval(() => {
      setSimulatedMetrics(prev => {
        const nextProg = prev.progress >= 100 ? 0 : prev.progress + 0.5;
        return {
          speed: Math.floor(65 + Math.random() * 8),
          fuelPct: prev.progress >= 100 ? 84 : Number((prev.fuelPct - 0.02).toFixed(2)),
          lat: (23.0225 + (nextProg * 0.002)).toFixed(4) + '° N',
          lng: (72.5714 + (nextProg * 0.003)).toFixed(4) + '° E',
          progress: nextProg
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEnterConsole = () => {
    if (loading) return;
    router.replace(user ? '/dashboard' : '/login');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-screen relative bg-[#040712] text-slate-100 overflow-x-hidden flex flex-col justify-between p-4 md:p-12 premium-bg selection:bg-cyan-500/30">
      
      {/* Background Matrix Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-cyan-500/10 via-blue-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between relative z-10 w-full max-w-7xl mx-auto border-b border-slate-900 pb-4">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <span className="font-bold text-black text-lg tracking-tighter font-display">T</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white font-mono">Transit<span className="text-cyan-400">Ops</span></span>
        </div>
        <div className="flex items-center space-x-4 font-mono text-[11px]">
          <span className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Telemetry Stream Secure</span>
          </span>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto relative z-10 w-full max-w-7xl mx-auto py-12">
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400">Platform Core Gateway</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-[1.05]">
            Command Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">Fleet Ecosystem</span> <br />
            In Real Time.
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md">
            Say goodbye to manual logbooks. Regulate vehicle entries, protect capacity limitations, track driver safety scores, and control operational costs inside a high-performance workspace.
          </p>
          <div className="pt-2">
            <button onClick={handleEnterConsole} disabled={loading} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl text-sm transition-all duration-200 hover:opacity-95 active:scale-[0.98] shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center justify-center space-x-3 group">
              <span>{loading ? 'Initializing Core...' : 'Launch Operational Console'}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Live Truck Monitoring Grid Overlay */}
        <div className="lg:col-span-7 w-full flex flex-col justify-center relative">
          <div className="flex space-x-2 mb-3 bg-slate-950/60 p-1 rounded-xl border border-slate-800/60 w-fit">
            {(['all', 'van05', 'heavy'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${activeTab === tab ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
                {tab === 'all' ? 'GLOBAL ARRAY' : tab === 'van05' ? 'VAN-05 TRACKING' : 'HEAVY-TRUCK-12'}
              </button>
            ))}
          </div>

          <div className="w-full glass-card relative overflow-hidden group min-h-[340px] flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="flex justify-between items-start border-b border-slate-800/60 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">Active Telemetry Instance</span>
                <h3 className="text-lg font-bold text-white font-display mt-0.5">
                  {activeTab === 'heavy' ? 'Heavy-Truck-12' : 'Van-05'} <span className="text-xs text-slate-500 font-mono font-normal">({simulatedMetrics.lat}, {simulatedMetrics.lng})</span>
                </h3>
              </div>
              <span className="status-pill border-signal-amber/30 text-signal-amber bg-signal-amber/5">ON TRIP</span>
            </div>

            <div className="my-6 space-y-2">
              <div className="flex justify-between font-mono text-[11px] text-slate-400">
                <span>HUB_MUMBAI (ORIGIN)</span>
                <span>TERM_DELHI (DEST)</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full relative border border-slate-800">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" style={{ width: `${simulatedMetrics.progress}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-cyan-400 shadow-[0_0_12px_#fff]" style={{ left: `calc(${simulatedMetrics.progress}% - 6px)` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/60 pt-4">
              <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-900"><span className="block font-mono text-[10px] text-slate-500 uppercase">Velocity</span><span className="font-display font-bold text-xl text-white">{simulatedMetrics.speed} km/h</span></div>
              <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-900"><span className="block font-mono text-[10px] text-slate-500 uppercase">Fuel Level</span><span className="font-display font-bold text-xl text-signal-teal">{simulatedMetrics.fuelPct}%</span></div>
              <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-900"><span className="block font-mono text-[10px] text-slate-500 uppercase">Operator</span><span className="font-display font-bold text-sm text-white truncate block mt-1">Alex (ID-101)</span></div>
              <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-900"><span className="block font-mono text-[10px] text-slate-500 uppercase">Load Capacity</span><span className="font-display font-bold text-xl text-signal-amber">{activeTab === 'heavy' ? '86%' : '90%'}</span></div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= NEW CREATIVE SECTION 1: LIFECYCLE SIMULATOR ================= */}
      <section className="w-full max-w-7xl mx-auto py-16 relative z-10 border-t border-slate-900/60">
        <div className="mb-8">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Interactive Proof of Concept</span>
          <h2 className="text-3xl font-bold font-display text-white mt-1">Core System Step-Workflow</h2>
          <p className="text-slate-400 text-sm mt-1">Click the steps below to simulate how the system satisfies the mandatory business rules automatically.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Step Selection Toggles */}
          <div className="lg:col-span-4 space-y-2">
            {[
              { step: 1, label: 'Asset Registration', desc: 'Register Van-05 (500kg Capacity)' },
              { step: 2, label: 'Driver Compliance Check', desc: 'Verify Alex & license conditions' },
              { step: 3, label: 'Intelligent Trip Validation', desc: 'Enforce load capacity rules (450kg)' },
              { step: 4, label: 'Automated Status Swap', desc: 'Transition vehicle & driver to On Trip' },
              { step: 5, label: 'Maintenance Log Isolation', desc: 'Lock asset to "In Shop", remove from pool' }
            ].map(item => (
              <button
                key={item.step}
                onClick={() => setActiveWorkflowStep(item.step)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center space-x-4 ${
                  activeWorkflowStep === item.step 
                    ? 'bg-gradient-to-r from-cyan-950/40 to-transparent border-cyan-500/40 text-white shadow-lg' 
                    : 'bg-slate-950/20 border-slate-900 text-slate-400 hover:border-slate-800'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center border ${activeWorkflowStep === item.step ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>{item.step}</div>
                <div>
                  <div className="text-xs font-bold font-mono tracking-wide text-white">{item.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Simulated Code/UI Console Container Output */}
          <div className="lg:col-span-8 bg-[#02050e] border border-slate-900 rounded-2xl p-6 relative overflow-hidden min-h-[300px] flex flex-col justify-between shadow-inner">
            <div className="absolute top-2 right-4 font-mono text-[10px] text-slate-600">STATE_LOGGER_ACTIVE</div>
            
            <div className="space-y-4">
              <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Console View Terminal
              </span>

              {activeWorkflowStep === 1 && (
                <div className="space-y-3 font-mono text-xs">
                  <p className="text-slate-400">&gt; Initializing Asset Registry Stream...</p>
                  <p className="text-emerald-400">✓ Vehicle "Van-05" registered successfully with UUID entry.</p>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-900">
                    <span className="text-slate-500">Asset Parameters:</span>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-[11px]">
                      <div>Type: <span className="text-white">Light Cargo Van</span></div>
                      <div>Max Payload: <span className="text-cyan-400">500 kg</span></div>
                      <div>Odometer: <span className="text-white">12,450 km</span></div>
                      <div>Operational Status: <span className="text-emerald-400 font-bold">AVAILABLE</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeWorkflowStep === 2 && (
                <div className="space-y-3 font-mono text-xs">
                  <p className="text-slate-400">&gt; Fetching Identity Pool for Operator "Alex"...</p>
                  <p className="text-emerald-400">✓ Security Status verified: License Active. Expiry Date safe.</p>
                  <p className="text-slate-400">&gt; Safety Score check returned value: <span className="text-cyan-400 font-bold">98% efficiency</span></p>
                </div>
              )}

              {activeWorkflowStep === 3 && (
                <div className="space-y-3 font-mono text-xs">
                  <p className="text-slate-400">&gt; Incoming Trip Dispatch Requested. Cargo Load: <span className="text-white font-bold">450 kg</span></p>
                  <p className="text-yellow-500">⚙ Enforcing Business Logic: 450 kg ≤ 500 kg Max Threshold Capacity...</p>
                  <p className="text-emerald-400 font-bold">✓ Validation Passed. Dispatch operation authorized.</p>
                </div>
              )}

              {activeWorkflowStep === 4 && (
                <div className="space-y-3 font-mono text-xs">
                  <p className="text-slate-400">&gt; Triggering System Transition Cascades...</p>
                  <div className="flex space-x-4 bg-slate-950 p-3 rounded-lg border border-slate-900 text-[11px]">
                    <div>Vehicle Status: <span className="text-slate-500">Available →</span> <span className="text-signal-amber font-bold">ON TRIP</span></div>
                    <div>Driver Status: <span className="text-slate-500">Available →</span> <span className="text-signal-amber font-bold">ON TRIP</span></div>
                  </div>
                  <p className="text-slate-500 text-[11px]">Automatic safety rule locks applied. Assets isolated from other available selection pools.</p>
                </div>
              )}

              {activeWorkflowStep === 5 && (
                <div className="space-y-3 font-mono text-xs">
                  <p className="text-slate-400">&gt; Maintenance Trigger: Initiating record log for [Oil Change].</p>
                  <p className="text-red-400">⚠️ System Override: Status switched to "In Shop" automatically.</p>
                  <p className="text-slate-500 font-sans text-[11px]">Asset is now hidden from the Driver selection pool to prevent conflict scheduling anomalies.</p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-900 pt-3 flex justify-between items-center text-[10px] font-mono text-slate-600">
              <span>ACTIVE SCHEMA: PRODUCTION_v2</span>
              <span>COMPILER STATUS: STABLE</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= NEW CREATIVE SECTION 2: PERSONA TELEMETRY VIEWS ================= */}
      <section className="w-full max-w-7xl mx-auto py-12 relative z-10 border-t border-slate-900/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Target Operational Matrix</span>
            <h2 className="text-3xl font-bold font-display text-white mt-1">Multi-Role Persona Adaptations</h2>
          </div>
          
          {/* Persona Selection Pills */}
          <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-900 mt-4 md:mt-0">
            {[
              { id: 'manager', name: 'Fleet Manager' },
              { id: 'safety', name: 'Safety Officer' },
              { id: 'finance', name: 'Financial Analyst' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setActivePersona(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activePersona === p.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm' : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display Matrix based on choice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activePersona === 'manager' && (
            <>
              <div className="card"><span className="text-slate-400 font-mono text-xs uppercase block">Asset Lifecycle Hub</span><p className="text-white font-sans text-sm mt-3 leading-relaxed">Oversee complete vehicle registries, current status mappings, odometer adjustments, and preventative maintenance logs instantly.</p></div>
              <div className="card"><span className="text-slate-400 font-mono text-xs uppercase block">Fleet Utilization %</span><p className="text-white font-sans text-sm mt-3 leading-relaxed">Monitor real-time operational capacity variables to maximize transit grid distributions and prevent underutilization bottlenecks.</p></div>
              <div className="card border-dashed border-cyan-500/20 flex items-center justify-center p-6 bg-cyan-950/5"><div className="text-center"><span className="text-cyan-400 font-mono text-xs block font-bold">MANAGEMENT MODULE ACTIVE</span><span className="text-[11px] text-slate-500 mt-1 block">Full CRUD parameters unlocked inside core panels.</span></div></div>
            </>
          )}

          {activePersona === 'safety' && (
            <>
              <div className="card"><span className="text-slate-400 font-mono text-xs uppercase block">Compliance Tracking</span><p className="text-white font-sans text-sm mt-3 leading-relaxed">Automatic reminders catch expired licenses or suspended driver status indicators instantly, mitigating route legal vulnerabilities.</p></div>
              <div className="card"><span className="text-slate-400 font-mono text-xs uppercase block">Driver Behavior Indices</span><p className="text-white font-sans text-sm mt-3 leading-relaxed">Tracks relative safety scores based on active trip metrics, establishing high-quality operational transparency variables.</p></div>
              <div className="card border-dashed border-red-500/20 flex items-center justify-center p-6 bg-red-950/5"><div className="text-center"><span className="text-red-400 font-mono text-xs block font-bold">SAFETY OVERWATCH STATUS</span><span className="text-[11px] text-slate-500 mt-1 block">License alert filters actively deployed across system endpoints.</span></div></div>
            </>
          )}

          {activePersona === 'finance' && (
            <>
              <div className="card"><span className="text-slate-400 font-mono text-xs uppercase block">Automated Ledger Costing</span><p className="text-white font-sans text-sm mt-3 leading-relaxed">Fuel expenditures, tolls, and repair costs are automatically calculated to give you clean metrics per vehicle unit asset.</p></div>
              <div className="card"><span className="text-slate-400 font-mono text-xs uppercase block">Algorithmic Vehicle ROI</span><p className="text-white font-sans text-sm mt-3 leading-relaxed">Computes financial yield curves using custom margin analytics, ready for immediate spreadsheet CSV export routines.</p></div>
              <div className="card border-dashed border-emerald-500/20 flex items-center justify-center p-6 bg-emerald-950/5"><div className="text-center"><span className="text-emerald-400 font-mono text-xs block font-bold">MARGIN LEDGER CONNECTED</span><span className="text-[11px] text-slate-500 mt-1 block">Operational expenditure data compiled securely.</span></div></div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-slate-500 border-t border-slate-900 pt-6 w-full max-w-7xl mx-auto">
        <div className="flex space-x-6 mb-2 sm:mb-0">
          <div>NODE ID: <span className="text-slate-300">TRANSIT_CORE_MUM01</span></div>
          <div>REFRESH RATE: <span className="text-slate-300">1000MS</span></div>
        </div>
        <div>TRANSITOPS CLOUD PLATFORM CONTROLS © 2026</div>
      </footer>

    </div>
  );
}