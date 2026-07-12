'use client';

import React, { useState } from 'react';

interface Vehicle {
  id: string;
  model: string;
  type: string;
  capacity: number;
  odo: string;
  status: 'Available' | 'On Trip' | 'In Shop' | 'Retired';
}

export default function VehicleRegistry() {
  // Integration Note: Seed state via GET /api/vehicles from Express
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'Van-05', model: 'Mercedes-Benz Sprinter', type: 'Heavy Cargo', capacity: 500, odo: '12,450 km', status: 'Available' },
    { id: 'Truck-02', model: 'Volvo FH16 Heavy', type: 'Long-Haul Semi', capacity: 15000, odo: '84,120 km', status: 'On Trip' },
    { id: 'Box-11', model: 'Isuzu NPR E-Series', type: 'Medium Duty', capacity: 4500, odo: '45,200 km', status: 'In Shop' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ id: '', model: '', type: 'Heavy Cargo', capacity: 500, odo: '0 km' });

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    // Integration Note: POST /api/vehicles
    const asset: Vehicle = {
      id: newVehicle.id,
      model: newVehicle.model,
      type: newVehicle.type,
      capacity: Number(newVehicle.capacity),
      odo: newVehicle.odo,
      status: 'Available'
    };
    setVehicles([asset, ...vehicles]);
    setIsModalOpen(false);
    setNewVehicle({ id: '', model: '', type: 'Heavy Cargo', capacity: 500, odo: '0 km' });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Vehicle Registry</h2>
          <p className="text-sm text-slate-400">Manage asset attributes, hardware lifecycles, and availability layers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 border border-indigo-500/30"
        >
          + Provision New Asset
        </button>
      </div>

      {/* Main Asset Table View */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 text-[11px] font-semibold tracking-wider uppercase">
              <th className="p-4">Reg Asset ID</th>
              <th className="p-4">Model Description</th>
              <th className="p-4">Type</th>
              <th className="p-4">Payload Threshold</th>
              <th className="p-4">Odometer Reading</th>
              <th className="p-4">Status Anchor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="p-4 font-mono font-bold text-white">{vehicle.id}</td>
                <td className="p-4 font-medium">{vehicle.model}</td>
                <td className="p-4 text-slate-400">{vehicle.type}</td>
                <td className="p-4 font-mono text-slate-400">{vehicle.capacity} kg</td>
                <td className="p-4 font-mono">{vehicle.odo}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    vehicle.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    vehicle.status === 'On Trip' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {vehicle.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Premium Creation Slide/Modal Layer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl animate-scale-in">
            <div>
              <h3 className="text-lg font-bold text-white">Register Asset</h3>
              <p className="text-xs text-slate-400">Enforce accurate constraints for weight validation formulas.</p>
            </div>
            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Registration ID (Unique)</label>
                <input 
                  type="text" required placeholder="e.g., Van-05"
                  value={newVehicle.id} onChange={e => setNewVehicle({...newVehicle, id: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Model Name</label>
                <input 
                  type="text" required placeholder="e.g., Mercedes-Benz Sprinter"
                  value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Max Payload Capacity (kg)</label>
                <input 
                  type="number" required placeholder="500"
                  value={newVehicle.capacity} onChange={e => setNewVehicle({...newVehicle, capacity: Number(e.target.value)})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 text-slate-300 text-xs py-2.5 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white text-xs py-2.5 rounded-xl hover:bg-indigo-500 transition-colors font-medium"
                >
                  Commit Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}