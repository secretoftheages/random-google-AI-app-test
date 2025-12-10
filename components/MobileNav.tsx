import React from 'react';
import { LayoutDashboard, Map, ShoppingCart, ShieldCheck, Zap } from 'lucide-react';
import { Screen } from '../types';

interface MobileNavProps {
  activeScreen: Screen;
  setActiveScreen: (s: Screen) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeScreen, setActiveScreen }) => {
  const menuItems = [
    { id: Screen.DASHBOARD, label: 'Dash', icon: LayoutDashboard },
    { id: Screen.OPERATIONS, label: 'Ops', icon: Map },
    { id: Screen.TECH_TREE, label: 'Tech', icon: Zap },
    { id: Screen.MARKETPLACE, label: 'Market', icon: ShoppingCart },
    { id: Screen.RISK_POOL, label: 'Pool', icon: ShieldCheck },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700 flex justify-around items-center h-16 z-50 pb-safe">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]' : ''} />
            <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
            {isActive && <div className="absolute top-0 w-8 h-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(129,140,248,1)]" />}
          </button>
        );
      })}
    </nav>
  );
};