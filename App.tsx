import React, { useState, useEffect } from 'react';
import { GameState, Screen } from './types';
import { INITIAL_STATE } from './constants';
import { processGameTick } from './services/gameLogic';
import { Dashboard } from './components/Dashboard';
import { Operations } from './components/Operations';
import { Marketplace } from './components/Marketplace';
import { RiskPool } from './components/RiskPool';
import { TechTree } from './components/TechTree';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.DASHBOARD);
  const [paused, setPaused] = useState(false);

  // Main Game Loop
  useEffect(() => {
    if (paused) return;

    const intervalId = setInterval(() => {
      setGameState((prevState) => processGameTick(prevState));
    }, 1000); // 1 second tick

    return () => clearInterval(intervalId);
  }, [paused]);

  const renderScreen = () => {
    switch (activeScreen) {
      case Screen.DASHBOARD:
        return <Dashboard gameState={gameState} />;
      case Screen.OPERATIONS:
        return <Operations gameState={gameState} setGameState={setGameState} />;
      case Screen.TECH_TREE:
        return <TechTree gameState={gameState} setGameState={setGameState} />;
      case Screen.MARKETPLACE:
        return <Marketplace gameState={gameState} setGameState={setGameState} />;
      case Screen.RISK_POOL:
        return <RiskPool gameState={gameState} setGameState={setGameState} />;
      default:
        return <Dashboard gameState={gameState} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-slate-900 text-slate-200 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar - Hidden on Mobile */}
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-14 lg:h-16 border-b border-slate-700 bg-slate-800/90 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 z-10 shrink-0">
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="flex flex-col leading-tight">
               <h1 className="text-lg lg:text-xl font-bold tracking-wider text-indigo-400">
                BORDERLINE
              </h1>
              <span className="text-[10px] text-slate-500 font-mono hidden lg:inline">SHADOW NETWORKS™</span>
            </div>
            
            <div className="h-6 w-px bg-slate-700 mx-2 hidden lg:block" />
            
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>DAY: {gameState.day}</span>
              <span className="text-slate-600">|</span>
              <span>HEAT: <span className={gameState.globalHeat > 50 ? 'text-red-400' : 'text-emerald-400'}>{gameState.globalHeat.toFixed(0)}%</span></span>
              <span className="text-slate-600">|</span>
              <span className="text-indigo-400">LVL {gameState.level}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest hidden lg:block">Liquid Capital</span>
              <span className="text-sm lg:text-xl font-mono font-bold text-emerald-400">
                ${gameState.money.toLocaleString()}
              </span>
            </div>
            {/* Risk pool hidden on very small screens in header to save space */}
             <div className="flex-col items-end hidden sm:flex">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest hidden lg:block">Risk Pool</span>
              <span className="text-sm lg:text-xl font-mono font-bold text-blue-400">
                ${gameState.riskPoolBalance.toLocaleString()}
              </span>
            </div>
             <button 
              onClick={() => setPaused(!paused)}
              className={`px-2 lg:px-3 py-1 text-[10px] lg:text-xs font-bold rounded border ${paused ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-slate-700 border-slate-600 text-slate-300'}`}
            >
              {paused ? 'PAUSED' : 'LIVE'}
            </button>
          </div>
        </header>

        {/* Dynamic Screen Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth pb-24 lg:pb-6">
          {renderScreen()}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Hidden on Desktop */}
      <MobileNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
    </div>
  );
}