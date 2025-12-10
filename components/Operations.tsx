import React, { useState } from 'react';
import { GameState, CommodityType, RouteType, StrategyType, Shipment } from '../types';
import { COMMODITIES, ROUTE_CONFIG, TECH_TREE_NODES } from '../constants';
import { calculateRisk } from '../services/gameLogic';
import { Plane, Ship, Truck, Target, Crosshair, Bot, Fan, Skull, Package, Zap, Box, Lock, AlertTriangle } from 'lucide-react';
import { LiveMap } from './LiveMap';

interface OperationsProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const Operations: React.FC<OperationsProps> = ({ gameState, setGameState }) => {
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityType>(CommodityType.METHRAX);
  const [selectedRoute, setSelectedRoute] = useState<RouteType>(RouteType.SOUTHWEST_MEGAPORT);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>(StrategyType.STANDARD);
  const [amount, setAmount] = useState<number>(10);

  // Logic to launch shipment
  const handleLaunch = () => {
    if (gameState.inventory[selectedCommodity] < amount) return;
    
    let strategyCost = 0;
    if (selectedStrategy === StrategyType.DECOY) strategyCost = 2000;
    if (selectedStrategy === StrategyType.PREMIUM_CONCEALMENT) strategyCost = 500;
    if (gameState.money < strategyCost) return;

    const newInventory = { ...gameState.inventory };
    newInventory[selectedCommodity] -= amount;

    const commConfig = COMMODITIES[selectedCommodity];
    const estimatedValue = amount * gameState.marketPrices[selectedCommodity];
    const risk = calculateRisk(selectedCommodity, selectedRoute, selectedStrategy, amount, gameState.routeStats[selectedRoute].heat);

    const newShipment: Shipment = {
      id: Math.random().toString(36),
      commodity: selectedCommodity,
      amount: amount,
      route: selectedRoute,
      strategy: selectedStrategy,
      progress: 0,
      risk: risk,
      potentialRevenue: estimatedValue,
      cost: amount * commConfig.baseCost + strategyCost,
      status: 'in-transit',
      log: ['Dispatched from safehouse.']
    };

    setGameState(prev => ({
      ...prev,
      inventory: newInventory,
      money: prev.money - strategyCost,
      activeShipments: [...prev.activeShipments, newShipment],
      notifications: [...prev.notifications, {
        id: Math.random().toString(),
        title: 'Operation Launched',
        message: `Moving ${amount} ${selectedCommodity} via ${selectedRoute}`,
        type: 'info',
        timestamp: Date.now()
      }]
    }));
  };

  const currentRisk = calculateRisk(selectedCommodity, selectedRoute, selectedStrategy, amount, gameState.routeStats[selectedRoute].heat);
  const projectedRevenue = amount * gameState.marketPrices[selectedCommodity];

  const getRouteIcon = (r: RouteType) => {
    switch (r) {
      case RouteType.AIR_FREIGHT: return <Plane className="mb-2" size={24} />;
      case RouteType.MARITIME_BLUE_ZONE: return <Ship className="mb-2" size={24} />;
      case RouteType.LOW_ALTITUDE_DRONE: return <Bot className="mb-2" size={24} />;
      case RouteType.VIP_HELICOPTER: return <Fan className="mb-2" size={24} />;
      default: return <Truck className="mb-2" size={24} />;
    }
  };

  const getCommodityIcon = (c: CommodityType) => {
    switch(c) {
      case CommodityType.FENTALYTE: return <Skull className="mb-2 text-purple-400" size={24} />;
      case CommodityType.COCAETHER: return <Package className="mb-2 text-white" size={24} />;
      case CommodityType.METHRAX: return <Zap className="mb-2 text-blue-400" size={24} />;
      case CommodityType.HERONA: return <Box className="mb-2 text-amber-600" size={24} />;
    }
  }

  // Check locks
  const isRouteLocked = (r: RouteType) => {
    const node = TECH_TREE_NODES.find(n => n.unlocksRoute === r);
    // If no node unlocks it, it's default unlocked. If node exists, must be in unlockedTechs
    if (!node) return false;
    return !gameState.unlockedTechs.includes(node.id);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
      {/* Configuration Panel */}
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-slate-800 p-4 lg:p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="text-indigo-400" /> Mission Planner
          </h2>

          <div className="space-y-6">
            {/* Commodity Select - Visual Cards */}
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-3 tracking-wider">Select Payload</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(COMMODITIES).map(c => {
                  const locked = gameState.level < c.requiredLevel;
                  return (
                    <button
                      key={c.id}
                      onClick={() => !locked && setSelectedCommodity(c.id)}
                      disabled={locked}
                      className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center transition-all relative overflow-hidden ${
                        selectedCommodity === c.id 
                          ? 'bg-indigo-900/60 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                          : locked
                          ? 'bg-slate-900 border-slate-800 text-slate-600 opacity-70 cursor-not-allowed'
                          : 'bg-slate-700/30 border-slate-600 text-slate-400 hover:bg-slate-700/50'
                      }`}
                    >
                      {locked ? <Lock className="mb-2" size={24} /> : getCommodityIcon(c.id)}
                      <div className="font-bold text-xs lg:text-sm mb-1">{c.name}</div>
                      {locked ? (
                          <div className="text-[10px] text-red-500 font-mono mt-1">LVL {c.requiredLevel} REQ</div>
                      ) : (
                          <>
                            <div className="text-[10px] opacity-70">Stock: {gameState.inventory[c.id]}</div>
                            <div className="text-[10px] text-emerald-400 font-mono mt-1">${gameState.marketPrices[c.id]}/u</div>
                          </>
                      )}
                      {selectedCommodity === c.id && <div className="absolute inset-0 border-2 border-indigo-500 rounded-lg pointer-events-none" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Route Select - Visual Cards */}
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-3 tracking-wider">Select Logistics Channel</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(ROUTE_CONFIG).map(([key, config]) => {
                   const rType = key as RouteType;
                   const stats = gameState.routeStats[rType];
                   const isSelected = selectedRoute === rType;
                   const locked = isRouteLocked(rType);
                   
                   return (
                    <button
                      key={key}
                      onClick={() => !locked && setSelectedRoute(rType)}
                      disabled={locked}
                      className={`p-4 rounded-lg border text-left transition-all relative overflow-hidden group ${
                        isSelected
                          ? 'bg-slate-700 border-indigo-500 text-indigo-100 ring-1 ring-indigo-500' 
                          : locked
                          ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
                          : 'bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                           {locked ? <Lock className="mb-2" size={24} /> : getRouteIcon(rType)}
                           <span className="font-bold text-sm leading-tight">{rType}</span>
                        </div>
                        {!locked && (
                           <div className={`text-[10px] font-mono px-2 py-1 rounded-full ${stats.heat > 50 ? 'bg-red-900/50 text-red-200 border border-red-800' : 'bg-slate-600/50 text-slate-300 border border-slate-500'}`}>
                             {stats.heat.toFixed(0)}% HEAT
                           </div>
                        )}
                      </div>
                      <div className="text-[10px] opacity-60 mt-2 leading-relaxed">
                          {locked ? 'Tech Upgrade Required' : config.description}
                      </div>
                    </button>
                   );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strategy */}
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-400 mb-3 tracking-wider">Tactical Approach</label>
                  <div className="relative">
                    <select 
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-4 text-slate-200 appearance-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                        value={selectedStrategy}
                        onChange={(e) => setSelectedStrategy(e.target.value as StrategyType)}
                    >
                        {Object.values(StrategyType).map(s => (
                        <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Amount Slider */}
                <div>
                    <label className="block text-xs uppercase font-bold text-slate-400 mb-3 tracking-wider">Shipment Volume</label>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <input 
                            type="range" 
                            min="1" 
                            max={Math.max(1, gameState.inventory[selectedCommodity])} 
                            value={amount}
                            onChange={(e) => setAmount(parseInt(e.target.value))}
                            className="w-full h-4 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <div className="flex justify-between mt-3 text-sm font-mono">
                            <span className="text-slate-500">1</span>
                            <span className="text-indigo-400 font-bold text-xl">{amount} <span className="text-xs text-slate-500 font-normal">UNITS</span></span>
                            <span className="text-slate-500">{gameState.inventory[selectedCommodity]}</span>
                        </div>
                    </div>
                </div>
            </div>

          </div>

          {/* Action Bar */}
          <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex justify-between w-full md:w-auto gap-8 text-sm bg-slate-900/50 p-4 rounded-lg border border-slate-700">
               <div>
                 <span className="block text-slate-500 text-[10px] uppercase tracking-wider">Est. Value</span>
                 <span className="font-mono text-emerald-400 text-lg font-bold">${projectedRevenue.toLocaleString()}</span>
               </div>
               <div className="text-right md:text-left">
                 <span className="block text-slate-500 text-[10px] uppercase tracking-wider">Risk Prob.</span>
                 <span className={`font-mono text-lg font-bold ${(currentRisk * 100) > 50 ? 'text-red-500' : (currentRisk * 100) > 20 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                   {(currentRisk * 100).toFixed(1)}%
                 </span>
               </div>
            </div>

            <button
              onClick={handleLaunch}
              disabled={gameState.inventory[selectedCommodity] < amount || (selectedStrategy === StrategyType.DECOY && gameState.money < 2000)}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-900/50 transition-all transform active:scale-95 flex items-center justify-center gap-3"
            >
              <Crosshair size={20} /> LAUNCH OPERATION
            </button>
          </div>
        </div>
      </div>

      {/* Live Map Visualization */}
      <div className="flex flex-col gap-4">
        <LiveMap shipments={gameState.activeShipments} />
        
        <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-4 overflow-hidden flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Logs</h3>
            <div className="flex-1 overflow-y-auto space-y-2 text-[10px] font-mono">
                {gameState.activeShipments.length === 0 && <div className="text-slate-600 italic">No activity detected on sensor grid.</div>}
                {gameState.activeShipments.map(s => (
                    <div key={s.id} className="flex justify-between border-b border-slate-700 pb-1">
                        <span className="text-indigo-400">{s.route}</span>
                        <span className="text-slate-500">{s.progress.toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};