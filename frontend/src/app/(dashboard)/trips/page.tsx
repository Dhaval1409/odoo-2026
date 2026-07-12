'use client';

import React, { useState } from 'react';

export default function DispatchEngine() {
  // Simulated State Pools (Connect via GET /api/vehicles and /api/drivers in Express)
  const [vehicles] = useState([
    { id: 'Van-05', maxWeight: 500, status: 'Available' },
    { id: 'Truck-02', maxWeight: 15000, status: 'On Trip' },
    { id: 'Box-11', maxWeight: 4500, status: 'In Shop' }
  ]);

  const [drivers] = useState([
    { name: 'Alex', status: 'Available', licenseValid: true },
    { name: 'Marcus T.', status: 'Suspended', licenseValid: true },
    { name: 'Sarah K.', status: 'Available', licenseValid: false } // Expired License
  ]);

  const [trips, setTrips] = useState([
    { id: 'TRIP-204', vehicle: 'Van-05', driver: 'Alex', weight: 450, status: 'Dispatched' }
  ]);

  // Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState('Van-05');
  const [selectedDriverName, setSelectedDriverName] = useState('Alex');
  const [cargoWeight, setCargoWeight] = useState(450);
  const [validationError, setValidationError] = useState('');

  // Business Rule Validation Watcher
  const activeVehicle = vehicles.find(v => v.id === selectedVehicleId);
  const activeDriver = drivers.find(d => d.name === selectedDriverName);
  const weightViolation = activeVehicle ? cargoWeight > activeVehicle.maxWeight : false;

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeVehicle || activeVehicle.status !== 'Available') {
      setValidationError('Selected vehicle is unavailable or undergoing service.');
      return;
    }
    if (!activeDriver || activeDriver.status !== 'Available' || !activeDriver.licenseValid) {
      setValidationError('Driver must be completely Available with a valid active license.');
      return;
    }
    if (weightViolation) {
      setValidationError('Critical Overload: Cargo capacity violates asset threshold parameters.');
      return;
    }

    setValidationError('');
    
    // Integration Note: POST /api/trips
    const newTrip = {
      id: `TRIP-${Math.floor(100 + Math.random() * 900)}`,
      vehicle: selectedVehicleId,
      driver: selectedDriverName,
      weight: cargoWeight,
      status: 'Dispatched'
    };

    setTrips([...trips, newTrip]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Rules-Enforced Dispatch Wizard panel */}
      <div className="lg:col-span-1 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl h-fit space-y-4 shadow-xl">
        <div>
          <h3 className="text-md font-bold text-white">Primary Dispatch Control</h3>
          <p className="text-xs text-slate-400">Strict mandatory operational constraints run in real-time.</p>
        </div>

        <form onSubmit={handleDispatch} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Available Vehicle</label>
            <select 
              value={selectedVehicleId} 
              onChange={e => setSelectedVehicleId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none cursor-pointer"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id} disabled={v.status !== 'Available'}>
                  {v.id} (Max {v.maxWeight}kg) — {v.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Assign Active Driver</label>
            <select 
              value={selectedDriverName} 
              onChange={e => setSelectedDriverName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none cursor-pointer"
            >
              {drivers.map(d => (
                <option key={d.name} value={d.name} disabled={d.status !== 'Available' || !d.licenseValid}>
                  {d.name} — {!d.licenseValid ? 'Expired License' : d.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cargo Payload Mass (kg)</label>
            <input 
              type="number" 
              value={cargoWeight} 
              onChange={e => setCargoWeight(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
            {weightViolation ? (
              <p className="text-[11px] text-rose-400 mt-1 font-medium">⚠️ Critical weight rule violation</p>
            ) : (
              <p className="text-[11px] text-emerald-400 mt-1 font-medium">✔ Cargo weight within limits</p>
            )}
          </div>

          {validationError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-medium">
              {validationError}
            </div>
          )}

          <button 
            type="submit" 
            disabled={weightViolation}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/10 uppercase tracking-wide"
          >
            Authorize Deployment Flight
          </button>
        </form>
      </div>

      {/* Live Track Board Status Lanes */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-md font-bold text-white">Live Lifecycle Board</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Draft', 'Dispatched', 'Completed'].map((lane) => (
            <div key={lane} className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-4 min-h-[450px] space-y-3 backdrop-blur-md">
              <span className="text-xs font-bold text-slate-400 block border-b border-slate-800/60 pb-2 mb-2">{lane}</span>
              
              {trips.filter(t => t.status === lane).map((trip) => (
                <div key={trip.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 shadow-md group relative">
                  <div className="absolute top-0 left-0 h-0.5 w-full bg-indigo-500" />
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono font-bold text-white">{trip.id}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-indigo-950 border border-indigo-500/20 text-indigo-400 font-bold uppercase rounded-md tracking-wider">
                      Active
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <p>Asset: <span className="text-slate-200 font-medium">{trip.vehicle}</span></p>
                    <p>Driver: <span className="text-slate-200 font-medium">{trip.driver}</span></p>
                    <p>Mass Load: <span className="font-mono text-slate-300">{trip.weight} kg</span></p>
                  </div>
                  <div className="border-t border-slate-900/80 pt-2 flex justify-end">
                    <button className="text-[11px] text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                      Mark Complete ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}