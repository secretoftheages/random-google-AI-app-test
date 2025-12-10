import React from 'react';
import { GameState } from '../types';
import { TrendingUp, Activity, Package, AlertTriangle, Terminal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  gameState: GameState;
}

export const Dashboard: React.FC<DashboardProps> = ({ gameState }) => {
  const chartData = gameState.shipmentHistory.slice(0, 20).reverse().map((s, i) => ({
    name: `Run ${i}`,
    val: s.status === 'delivered' ? s.potentialRevenue : -s.cost
  }));

  if (chartData.length === 0) {
    chartData.push({ name: 'Start', val: 0 });
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* Net Worth */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp size={48} className="text-emerald-400" />
            </div>
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Net Worth</div>
          <div className="text-lg lg:text-2xl font-mono font-bold text-white z-10 relative">
            ${(gameState.money + gameState.riskPoolBalance).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Liquid + Insured Assets</div>
        </div>

        {/* Active Ops */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity size={48} className="text-indigo-400" />
            </div>
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Active Ops</div>
          <div className="text-lg lg:text-2xl font-mono font-bold text-white z-10 relative">
            {gameState.activeShipments.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">In transit</div>
        </div>

        {/* Inventory */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Package size={48} className="text-blue-400" />
            </div>
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Inventory</div>
          <div className="text-lg lg:text-2xl font-mono font-bold text-white z-10 relative">
            {Object.values(gameState.inventory).reduce((a: number, b: number) => a + b, 0)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Units stored</div>
        </div>

        {/* Heat Gauge */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
             <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Global Heat</div>
             <AlertTriangle size={16} className={gameState.globalHeat > 50 ? "text-red-400 animate-pulse" : "text-emerald-400"} />
          </div>
          
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden mb-2 border border-slate-700">
            <div 
                className={`h-full transition-all duration-500 ${gameState.globalHeat > 75 ? 'bg-red-500' : gameState.globalHeat > 40 ? 'bg-yellow-500' : 'bg-emerald-500'}`} 
                style={{ width: `${gameState.globalHeat}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px]">
             <span className="text-slate-500">Low Risk</span>
             <span className="font-mono font-bold text-white">{gameState.globalHeat.toFixed(1)}%</span>
             <span className="text-slate-500">Lockdown</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Chart */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-4 lg:p-6 shadow-lg">
          <h3 className="text-xs font-bold text-slate-300 mb-4 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={14} /> Revenue History
          </h3>
          <div className="h-48 lg:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" hide />
                <YAxis stroke="#475569" fontSize={10} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', fontSize: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-0 shadow-lg overflow-hidden flex flex-col h-64 lg:h-auto font-mono">
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
            <Terminal size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">System_Log</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {[...gameState.notifications].reverse().map((notif) => (
              <div key={notif.id} className={`text-xs border-l-2 pl-3 py-1 ${
                notif.type === 'error' ? 'border-red-500 text-red-300' :
                notif.type === 'success' ? 'border-emerald-500 text-emerald-300' :
                notif.type === 'warning' ? 'border-amber-500 text-amber-300' :
                'border-blue-500 text-slate-300'
              }`}>
                <div className="flex justify-between opacity-70 mb-0.5 text-[10px]">
                  <span>{notif.type.toUpperCase()}</span>
                  <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                </div>
                <div>{notif.message}</div>
              </div>
            ))}
            <div className="animate-pulse text-indigo-500 text-xs">_</div>
          </div>
        </div>
      </div>
    </div>
  );
};