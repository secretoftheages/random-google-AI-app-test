import React, { useState } from 'react';
import { GameState } from '../types';
import { Shield, Lock, Wallet, ArrowRight } from 'lucide-react';

interface RiskPoolProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const RiskPool: React.FC<RiskPoolProps> = ({ gameState, setGameState }) => {
  const [depositAmount, setDepositAmount] = useState(1000);

  const handleDeposit = () => {
    if (gameState.money >= depositAmount) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - depositAmount,
        riskPoolBalance: prev.riskPoolBalance + depositAmount,
        notifications: [...prev.notifications, {
          id: Math.random().toString(),
          title: 'Risk Pool Funded',
          message: `Deposited $${depositAmount} into stability fund.`,
          type: 'info',
          timestamp: Date.now()
        }]
      }));
    }
  };

  const handleWithdraw = () => {
    if (gameState.riskPoolBalance >= depositAmount) {
      setGameState(prev => ({
        ...prev,
        money: prev.money + depositAmount,
        riskPoolBalance: prev.riskPoolBalance - depositAmount,
        notifications: [...prev.notifications, {
          id: Math.random().toString(),
          title: 'Funds Liquidated',
          message: `Withdrew $${depositAmount} from stability fund.`,
          type: 'warning',
          timestamp: Date.now()
        }]
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Shield className="text-blue-400" size={32} /> Risk Tolerance Pools™
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          The math of loss. Allocate liquid capital into the organization's stability fund. 
          When a shipment is seized, the pool covers the production cost, preventing bankruptcy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-emerald-700" />
          <Wallet className="text-emerald-500 mb-4" size={48} />
          <div className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-2">Liquid Capital</div>
          <div className="text-4xl font-mono font-bold text-white mb-6">${gameState.money.toLocaleString()}</div>
          <p className="text-xs text-slate-500 px-8">Available for purchasing commodities, funding operations, and upgrades.</p>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-700" />
          <Lock className="text-blue-500 mb-4" size={48} />
          <div className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-2">Stability Pool</div>
          <div className="text-4xl font-mono font-bold text-white mb-6">${gameState.riskPoolBalance.toLocaleString()}</div>
          <p className="text-xs text-slate-500 px-8">Auto-deploys to cover material costs of seized shipments. Cannot be used for purchases.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-2xl mx-auto">
        <label className="block text-center text-slate-300 text-sm font-bold uppercase mb-4">Transfer Amount</label>
        
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setDepositAmount(Math.max(1000, depositAmount - 1000))}
            className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            -1k
          </button>
          <input 
             type="range"
             min="1000"
             max="50000"
             step="1000"
             value={depositAmount}
             onChange={(e) => setDepositAmount(parseInt(e.target.value))}
             className="flex-1 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <button 
            onClick={() => setDepositAmount(depositAmount + 1000)}
            className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            +1k
          </button>
        </div>
        
        <div className="text-center font-mono text-2xl text-white font-bold mb-8">
          ${depositAmount.toLocaleString()}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleDeposit}
            disabled={gameState.money < depositAmount}
            className="flex flex-col items-center justify-center py-4 px-6 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-all group disabled:opacity-50"
          >
            <span className="flex items-center gap-2 text-blue-400 font-bold mb-1 group-hover:translate-x-1 transition-transform">
              Liquid <ArrowRight size={16} /> Pool
            </span>
            <span className="text-xs text-slate-500">Secure Funds</span>
          </button>

          <button
            onClick={handleWithdraw}
            disabled={gameState.riskPoolBalance < depositAmount}
            className="flex flex-col items-center justify-center py-4 px-6 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-all group disabled:opacity-50"
          >
             <span className="flex items-center gap-2 text-emerald-400 font-bold mb-1 group-hover:-translate-x-1 transition-transform">
              Pool <ArrowRight size={16} className="rotate-180" /> Liquid
            </span>
            <span className="text-xs text-slate-500">Embezzle Funds</span>
          </button>
        </div>
      </div>
    </div>
  );
};