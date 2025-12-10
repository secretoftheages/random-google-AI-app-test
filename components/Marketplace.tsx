import React from 'react';
import { GameState, CommodityType } from '../types';
import { COMMODITIES } from '../constants';
import { ShoppingCart, TrendingUp, TrendingDown, Package, Skull, Zap, Box } from 'lucide-react';

interface MarketplaceProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ gameState, setGameState }) => {
  const handleBuy = (type: CommodityType, amount: number) => {
    const cost = COMMODITIES[type].baseCost * amount;
    if (gameState.money < cost) return;

    setGameState(prev => ({
      ...prev,
      money: prev.money - cost,
      inventory: {
        ...prev.inventory,
        [type]: prev.inventory[type] + amount
      },
      notifications: [...prev.notifications, {
        id: Math.random().toString(),
        title: 'Acquisition Confirmed',
        message: `Purchased ${amount} units of ${type}`,
        type: 'success',
        timestamp: Date.now()
      }]
    }));
  };

  const getCommodityIcon = (c: CommodityType) => {
    switch(c) {
      case CommodityType.FENTALYTE: return <Skull className="text-purple-400" size={20} />;
      case CommodityType.COCAETHER: return <Package className="text-white" size={20} />;
      case CommodityType.METHRAX: return <Zap className="text-blue-400" size={20} />;
      case CommodityType.HERONA: return <Box className="text-amber-600" size={20} />;
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-6">
      <div className="mb-6 lg:mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <ShoppingCart className="text-emerald-400" /> Black Market
            </h2>
            <p className="text-slate-400 text-sm">Supplier prices are static. Street prices fluctuate.</p>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-3 self-start lg:self-auto">
             <div className="text-xs text-slate-500 uppercase font-bold">Funds</div>
             <div className="text-xl font-mono text-emerald-400 font-bold">${gameState.money.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6">
        {Object.values(COMMODITIES).map((comm) => {
          const marketPrice = gameState.marketPrices[comm.id];
          const margin = ((marketPrice - comm.baseCost) / comm.baseCost) * 100;
          const isProfitable = margin > 0;

          return (
            <div key={comm.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 h-fit">
                        {getCommodityIcon(comm.id)}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white leading-none mb-1">{comm.name}</h3>
                        <p className="text-[10px] text-slate-500 line-clamp-2 max-w-[200px]">{comm.description}</p>
                    </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono font-bold border ${isProfitable ? 'bg-emerald-900/30 text-emerald-400 border-emerald-900' : 'bg-red-900/30 text-red-400 border-red-900'}`}>
                  {isProfitable ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                  {margin.toFixed(0)}%
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-sm mb-6 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[10px] uppercase">Cost</span>
                  <span className="font-mono text-white font-bold">${comm.baseCost}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-slate-500 text-[10px] uppercase">Street Price</span>
                  <span className="font-mono text-emerald-400 font-bold">${marketPrice.toFixed(0)}</span>
                </div>
                <div className="flex flex-col mt-2">
                   <span className="text-slate-500 text-[10px] uppercase">Owned</span>
                   <span className="font-mono text-indigo-300">{gameState.inventory[comm.id]}</span>
                </div>
                <div className="flex flex-col text-right mt-2">
                   <span className="text-slate-500 text-[10px] uppercase">Risk</span>
                   <span className="font-mono text-red-300">{(comm.riskProfile * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto flex gap-3">
                  <button 
                    onClick={() => handleBuy(comm.id, 10)}
                    disabled={gameState.money < comm.baseCost * 10}
                    className="flex-1 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-slate-600"
                  >
                    Buy 10 <span className="block text-[10px] opacity-60 font-mono">${(comm.baseCost * 10).toLocaleString()}</span>
                  </button>
                  <button 
                    onClick={() => handleBuy(comm.id, 100)}
                    disabled={gameState.money < comm.baseCost * 100}
                    className="flex-1 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-400 text-white text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-900/20"
                  >
                    Buy 100 <span className="block text-[10px] opacity-60 font-mono">${(comm.baseCost * 100).toLocaleString()}</span>
                  </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};