'use client';

import React, { useState } from 'react';

export default function MaintenanceWorkflow() {
  const [logs, setLogs] = useState([
    { id: 'MNT-801', asset: 'Box-11', type: 'Oil & Brake Overhaul', requested: '10 Jul 2026', currentStage: 'In Shop' }
  ]);
  const [selectedAsset, setSelectedAsset] = useState('Van-05');
  const [issueType, setIssueType] = useState('');

  const handleTriggerMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueType) return;

    // Integration Note: POST /api/maintenance -> triggers auto status override on Express backend
    const dynamicLog = {
      id: `MNT-${Math.floor(800 + Math.random() * 199)}`,
      asset: selectedAsset,
      type: issueType,
      requested: '12 Jul 2026',
      currentStage: 'In Shop'
    };

    setLogs([dynamicLog, ...logs]);
    setIssueType('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Request Form panel */}
      <div className="lg:col-span-1 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl h-fit space-y-4 shadow-xl">
        <div>
          <h3 className="text-md font-bold text-white">Route Asset to Bay</h3>
          <p className="text-xs text-slate-400">Submitting instantly switches the vehicle to &quot;In Shop&quot; status.</p>
        </div>

        <form onSubmit={handleTriggerMaintenance} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Asset ID</label>
            <select 
              value={selectedAsset} onChange={e => setSelectedAsset(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="Van-05">Van-05 (Available)</option>
              <option value="Truck-02">Truck-02 (On Trip)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Issue Profile Details</label>
            <textarea 
              rows={3} placeholder="Describe diagnostic targets or lifecycle updates..." required
              value={issueType} onChange={e => setIssueType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-amber-600/10 uppercase tracking-wide"
          >
            Isolate Asset into Bay
          </button>
        </form>
      </div>

      {/* Main Board logs table output container */}
      <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">Active Service Log Queue</h3>
        
        <div className="divide-y divide-slate-800/60">
          {logs.map((log) => (
            <div key={log.id} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">{log.id}</span>
                  <span className="text-[10px] bg-slate-950 border border-slate-800 text-amber-400 px-2 py-0.5 rounded-md font-mono">
                    {log.asset}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{log.type}</p>
                <p className="text-[10px] text-slate-500">Bay Entry Time: {log.requested}</p>
              </div>

              <button className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors">
                Close & Release Asset
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
