'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Direct local state for color toggle
  
  // Real-time tracking animation mock states
  const [activeTab, setActiveTab] = useState<'all' | 'van05' | 'heavy'>('all');
  const [simulatedMetrics, setSimulatedMetrics] = useState({
    speed: 68,
    fuelPct: 84,
    lat: '23.0225° N',
    lng: '72.5714° E',
    progress: 42
  });

  const [activeWorkflowStep, setActiveWorkflowStep] = useState(1);
  const [activePersona, setActivePersona] = useState('manager');

  useEffect(() => {
    setMounted(true);
    
    // Check system preference on initial mount
    const isDark = document.documentElement.classList.contains('dark') || 
                   localStorage.getItem('theme') === 'dark' ||
                   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    
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

  // Direct toggle function handling DOM manipulation immediately
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleEnterConsole = () => {
    if (loading) return;
    router.replace(user ? '/dashboard' : '/login');
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen w-screen relative overflow-x-hidden flex flex-col justify-between p-4 md:p-12 transition-colors duration-300 selection:bg-cyan-500/30 ${
      isDarkMode ? 'bg-[#040712] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Background Matrix Grids */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none ${
        isDarkMode ? 'opacity-100' : 'opacity-40'
      }`} />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-cyan-500/10 via-blue-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className={`flex items-center justify-between relative z-10 w-full max-w-7xl mx-auto border-b pb-4 ${
        isDarkMode ? 'border-slate-900' : 'border-slate-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <span className="font-bold text-black text-lg tracking-tighter font-display">T</span>
          </div>
          <span className="font-bold text-xl tracking-tight font-mono">
            Transit<span className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}>Ops</span>
          </span>
        </div>
        
        {/* Actions Menu containing Status and the Direct Inline Toggle Button */}
        <div className="flex items-center space-x-4 font-mono text-[11px]">
          <span className={`hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full uppercase tracking-wider border bg-emerald-500/10 text-emerald-500 ${
            isDarkMode ? 'border-emerald-500/20' : 'border-emerald-500/30'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Telemetry Stream Secure</span>
          </span>

          {/* INLINE THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300' 
                : 'bg-white border-slate-300 text-indigo-600 hover:text-indigo-800'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme Color"
          >
            {isDarkMode ? (
              // Sun Icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.197 5.197l1.591 1.591M17.213 17.213l1.591 1.591M3 12h2.25m13.5 0H21M5.197 19.803l1.591-1.591M17.213 6.787l1.591-1.591M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
              </svg>
            ) : (
              // Moon Icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto relative z-10 w-full max-w-7xl mx-auto py-12">
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Platform Core Gateway</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
            Command Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-500">Fleet Ecosystem</span> <br />
            In Real Time.
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed max-w-md ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
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
          <div className={`flex space-x-2 mb-3 p-1 rounded-xl border w-fit ${
            isDarkMode ? 'bg-slate-950/60 border-slate-800/60' : 'bg-slate-200/60 border-slate-300'
          }`}>
            {(['all', 'van05', 'heavy'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === tab 
                  ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}>
                {tab === 'all' ? 'GLOBAL ARRAY' : tab === 'van05' ? 'VAN-05 TRACKING' : 'HEAVY-TRUCK-12'}
              </button>
            ))}
          </div>

          <div className={`w-full border rounded-2xl p-6 relative overflow-hidden group min-h-[340px] flex flex-col justify-between shadow-2xl ${
            isDarkMode ? 'bg-slate-900/40 border-slate-800/80 shadow-cyan-950/20' : 'bg-white border-slate-200 shadow-slate-200'
          }`}>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className={`flex justify-between items-start border-b pb-4 ${isDarkMode ? 'border-slate-800/60' : 'border-slate-100'}`}>
              <div>
                <span className={`text-[10px] font-mono uppercase tracking-widest block ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Active Telemetry Instance</span>
                <h3 className="text-lg font-bold mt-0.5">
                  {activeTab === 'heavy' ? 'Heavy-Truck-12' : 'Van-05'} <span className="text-xs text-slate-500 font-mono font-normal">({simulatedMetrics.lat}, {simulatedMetrics.lng})</span>
                </h3>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border border-amber-500/30 text-amber-500 bg-amber-500/5 animate-pulse">ON TRIP</span>
            </div>

            <div className="my-6 space-y-2">
              <div className="flex justify-between font-mono text-[11px] text-slate-400">
                <span>HUB_MUMBAI (ORIGIN)</span>
                <span>TERM_DELHI (DEST)</span>
              </div>
              <div className={`w-full h-2 rounded-full relative border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-1000 ease-linear" style={{ width: `${simulatedMetrics.progress}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-cyan-400 shadow-[0_0_12px_#fff] transition-all duration-1000 ease-linear" style={{ left: `calc(${simulatedMetrics.progress}% - 6px)` }} />
              </div>
            </div>

            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 border-t pt-4 ${isDarkMode ? 'border-slate-800/60' : 'border-slate-100'}`}>
              <div className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-950/40 border-slate-900' : 'bg-slate-50 border-slate-100'}`}><span className="block font-mono text-[10px] text-slate-400 uppercase">Velocity</span><span className="font-bold text-xl">{simulatedMetrics.speed} km/h</span></div>
              <div className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-950/40 border-slate-900' : 'bg-slate-50 border-slate-100'}`}><span className="block font-mono text-[10px] text-slate-400 uppercase">Fuel Level</span><span className="font-bold text-xl text-teal-500">{simulatedMetrics.fuelPct}%</span></div>
              <div className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-950/40 border-slate-900' : 'bg-slate-50 border-slate-100'}`}><span className="block font-mono text-[10px] text-slate-400 uppercase">Operator</span><span className="font-bold text-sm truncate block mt-1">Alex (ID-101)</span></div>
              <div className={`p-2 rounded-lg border ${isDarkMode ? 'bg-slate-950/40 border-slate-900' : 'bg-slate-50 border-slate-100'}`}><span className="block font-mono text-[10px] text-slate-400 uppercase">Load Capacity</span><span className="font-bold text-xl text-amber-500">{activeTab === 'heavy' ? '86%' : '90%'}</span></div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= NEW CREATIVE SECTION 1: LIFECYCLE SIMULATOR ================= */}
      <section className={`w-full max-w-7xl mx-auto py-16 relative z-10 border-t ${isDarkMode ? 'border-slate-900/60' : 'border-slate-200'}`}>
        <div className="mb-8">
          <span className={`text-xs font-mono uppercase tracking-widest ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Interactive Proof of Concept</span>
          <h2 className="text-3xl font-bold mt-1">Core System Step-Workflow</h2>
          <p className="text-slate-400 text-sm mt-1">Click the steps below to simulate how the system satisfies the mandatory business rules automatically.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
                    ? 'bg-gradient-to-r from-cyan-500/5 to-transparent border-cyan-500/40 shadow-lg' 
                    : isDarkMode ? 'bg-slate-950/20 border-slate-900 text-slate-400 hover:border-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center border ${
                  activeWorkflowStep === item.step ? 'bg-cyan-500/20 border-cyan-400 text-cyan-500' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>{item.step}</div>
                <div>
                  <div className="text-xs font-bold font-mono tracking-wide">{item.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              </button>
            ))}
          </div>

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
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500">Asset Parameters:</span>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-[11px]">
                      <div className="text-slate-400">Type: <span className="text-white">Light Cargo Van</span></div>
                      <div className="text-slate-400">Max Payload: <span className="text-cyan-400">500 kg</span></div>
                      <div className="text-slate-400">Odometer: <span className="text-white">12,450 km</span></div>
                      <div className="text-slate-400">Operational Status: <span className="text-emerald-400 font-bold">AVAILABLE</span></div>
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
                  <div className="flex space-x-4 bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px]">
                    <div className="text-slate-400">Vehicle Status: <span className="text-slate-500">Available →</span> <span className="text-amber-400 font-bold">ON TRIP</span></div>
                    <div className="text-slate-400">Driver Status: <span className="text-slate-500">Available →</span> <span className="text-amber-400 font-bold">ON TRIP</span></div>
                  </div>
                </div>
              )}

              {activeWorkflowStep === 5 && (
                <div className="space-y-3 font-mono text-xs">
                  <p className="text-slate-400">&gt; Maintenance Trigger: Initiating record log for [Oil Change].</p>
                  <p className="text-red-400">⚠️ System Override: Status switched to "In Shop" automatically.</p>
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
      <section className={`w-full max-w-7xl mx-auto py-12 relative z-10 border-t ${isDarkMode ? 'border-slate-900/60' : 'border-slate-200'}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className={`text-xs font-mono uppercase tracking-widest ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Target Operational Matrix</span>
            <h2 className="text-3xl font-bold mt-1">Multi-Role Persona Adaptations</h2>
          </div>
          
          <div className={`flex space-x-1 p-1 rounded-xl border mt-4 md:mt-0 ${isDarkMode ? 'bg-slate-950 border-slate-900' : 'bg-slate-200/50 border-slate-300'}`}>
            {[
              { id: 'manager', name: 'Fleet Manager' },
              { id: 'safety', name: 'Safety Officer' },
              { id: 'finance', name: 'Financial Analyst' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setActivePersona(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activePersona === p.id 
                    ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm font-bold' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activePersona === 'manager' && (
            <>
              <div className={`border rounded-xl p-5 transition-all ${isDarkMode ? 'bg-slate-900/40 border-slate-900 hover:border-slate-800' : 'bg-white border-slate-200 hover:border-slate-300'}`}><span className="text-slate-400 font-mono text-xs uppercase block">Asset Lifecycle Hub</span><p className="text-sm mt-3 leading-relaxed">Oversee complete vehicle registries, current status mappings, odometer adjustments, and preventative maintenance logs instantly.</p></div>
              <div className={`border rounded-xl p-5 transition-all ${isDarkMode ? 'bg-slate-900/40 border-slate-900 hover:border-slate-800' : 'bg-white border-slate-200 hover:border-slate-300'}`}><span className="text-slate-400 font-mono text-xs uppercase block">Fleet Utilization %</span><p className="text-sm mt-3 leading-relaxed">Monitor real-time operational capacity variables to maximize transit grid distributions and prevent underutilization bottlenecks.</p></div>
              <div className="border border-dashed border-cyan-500/30 flex items-center justify-center p-6 bg-cyan-500/5 rounded-xl"><div className="text-center"><span className="text-cyan-600 dark:text-cyan-400 font-mono text-xs block font-bold">MANAGEMENT MODULE ACTIVE</span></div></div>
            </>
          )}

          {activePersona === 'safety' && (
            <>
              <div className={`border rounded-xl p-5 transition-all ${isDarkMode ? 'bg-slate-900/40 border-slate-900 hover:border-slate-800' : 'bg-white border-slate-200 hover:border-slate-300'}`}><span className="text-slate-400 font-mono text-xs uppercase block">Compliance Tracking</span><p className="text-sm mt-3 leading-relaxed">Automatic reminders catch expired licenses or suspended driver status indicators instantly, mitigating route legal vulnerabilities.</p></div>
              <div className={`border rounded-xl p-5 transition-all ${isDarkMode ? 'bg-slate-900/40 border-slate-900 hover:border-slate-800' : 'bg-white border-slate-200 hover:border-slate-300'}`}><span className="text-slate-400 font-mono text-xs uppercase block">Driver Behavior Indices</span><p className="text-sm mt-3 leading-relaxed">Tracks relative safety scores based on active trip metrics, establishing high-quality operational transparency variables.</p></div>
              <div className="border border-dashed border-red-500/30 flex items-center justify-center p-6 bg-red-500/5 rounded-xl"><div className="text-center"><span className="text-red-500 font-mono text-xs block font-bold">SAFETY OVERWATCH STATUS</span></div></div>
            </>
          )}

          {activePersona === 'finance' && (
            <>
              <div className={`border rounded-xl p-5 transition-all ${isDarkMode ? 'bg-slate-900/40 border-slate-900 hover:border-slate-800' : 'bg-white border-slate-200 hover:border-slate-300'}`}><span className="text-slate-400 font-mono text-xs uppercase block">Automated Ledger Costing</span><p className="text-sm mt-3 leading-relaxed">Fuel expenditures, tolls, and repair costs are automatically calculated to give you clean metrics per vehicle unit asset.</p></div>
              <div className={`border rounded-xl p-5 transition-all ${isDarkMode ? 'bg-slate-900/40 border-slate-900 hover:border-slate-800' : 'bg-white border-slate-200 hover:border-slate-300'}`}><span className="text-slate-400 font-mono text-xs uppercase block">Algorithmic Vehicle ROI</span><p className="text-sm mt-3 leading-relaxed">Computes financial yield curves using custom margin analytics, ready for immediate spreadsheet CSV export routines.</p></div>
              <div className="border border-dashed border-emerald-500/30 flex items-center justify-center p-6 bg-emerald-500/5 rounded-xl"><div className="text-center"><span className="text-emerald-500 font-mono text-xs block font-bold">MARGIN LEDGER CONNECTED</span></div></div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={`flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono border-t pt-6 w-full max-w-7xl mx-auto ${
        isDarkMode ? 'border-slate-900 text-slate-500' : 'border-slate-200 text-slate-400'
      }`}>
        <div className="flex space-x-6 mb-2 sm:mb-0">
          <div>NODE ID: <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>TRANSIT_CORE_MUM01</span></div>
          <div>REFRESH RATE: <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>1000MS</span></div>
        </div>
        <div>TRANSITOPS CLOUD PLATFORM CONTROLS © 2026</div>
      </footer>

    </div>
  );
}