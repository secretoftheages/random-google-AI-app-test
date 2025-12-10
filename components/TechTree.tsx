import React from 'react';
import { GameState, TechNode } from '../types';
import { TECH_TREE_NODES } from '../constants';
import { Truck, Map, Ship, Plane, Bot, Fan, Lock, Unlock, Zap } from 'lucide-react';

interface TechTreeProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const TechTree: React.FC<TechTreeProps> = ({ gameState, setGameState }) => {
  const handleUnlock = (node: TechNode) => {
    if (gameState.money >= node.cost && !gameState.unlockedTechs.includes(node.id)) {
      // Check parent constraint
      if (node.parentId && !gameState.unlockedTechs.includes(node.parentId)) return;

      setGameState(prev => ({
        ...prev,
        money: prev.money - node.cost,
        unlockedTechs: [...prev.unlockedTechs, node.id],
        notifications: [...prev.notifications, {
          id: Math.random().toString(),
          title: 'Upgrade Secured',
          message: `${node.name} unlocked. New logistics capabilities available.`,
          type: 'success',
          timestamp: Date.now()
        }]
      }));
    }
  };

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'Truck': return <Truck size={20} />;
      case 'Map': return <Map size={20} />;
      case 'Ship': return <Ship size={20} />;
      case 'Plane': return <Plane size={20} />;
      case 'Bot': return <Bot size={20} />;
      case 'Fan': return <Fan size={20} />;
      default: return <Zap size={20} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <Zap className="text-amber-400" /> Black Market Upgrades
        </h2>
        <p className="text-slate-400 text-sm">Invest in infrastructure to unlock advanced smuggling routes. Upgrades are permanent.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 relative">
         {/* Vertical connector line roughly positioned */}
         <div className="absolute left-6 lg:left-8 top-8 bottom-8 w-0.5 bg-slate-700 -z-10" />

         {TECH_TREE_NODES.map((node, index) => {
           const isUnlocked = gameState.unlockedTechs.includes(node.id);
           const parentUnlocked = !node.parentId || gameState.unlockedTechs.includes(node.parentId);
           const canAfford = gameState.money >= node.cost;
           const isLocked = !isUnlocked && !parentUnlocked;

           return (
             <div key={node.id} className={`relative flex items-center gap-4 p-4 lg:p-6 rounded-xl border-2 transition-all ${
               isUnlocked ? 'bg-slate-800/80 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 
               isLocked ? 'bg-slate-900/50 border-slate-800 opacity-60 grayscale' :
               'bg-slate-800 border-slate-600 hover:border-slate-400'
             }`}>
               {/* Node Indicator */}
               <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shrink-0 border-2 z-10 ${
                 isUnlocked ? 'bg-indigo-600 border-indigo-400 text-white' : 
                 isLocked ? 'bg-slate-800 border-slate-700 text-slate-600' :
                 'bg-slate-700 border-slate-500 text-slate-300'
               }`}>
                 {isUnlocked ? <Unlock size={24} /> : isLocked ? <Lock size={24} /> : getIcon(node.icon)}
               </div>

               <div className="flex-1">
                 <h3 className={`text-lg font-bold flex items-center gap-2 ${isUnlocked ? 'text-indigo-300' : 'text-slate-200'}`}>
                   {node.name}
                   {isUnlocked && <span className="text-[10px] bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">ACTIVE</span>}
                 </h3>
                 <p className="text-xs text-slate-400 mt-1">{node.description}</p>
                 
                 {!isUnlocked && !isLocked && (
                   <div className="mt-3 flex items-center gap-4">
                     <span className={`font-mono text-sm font-bold ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                       ${node.cost.toLocaleString()}
                     </span>
                     <button
                       onClick={() => handleUnlock(node)}
                       disabled={!canAfford}
                       className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-700 text-white text-xs font-bold transition-colors"
                     >
                       PURCHASE
                     </button>
                   </div>
                 )}
                 {isLocked && (
                   <div className="mt-2 text-xs text-red-500 font-mono flex items-center gap-1">
                     <Lock size={12} /> PREREQUISITE REQUIRED
                   </div>
                 )}
               </div>
             </div>
           );
         })}
      </div>
    </div>
  );
};