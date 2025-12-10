import React from 'react';
import { LayoutDashboard, Map, ShoppingCart, ShieldCheck } from 'lucide-react';
import { Screen } from '../types';

interface SidebarProps {
  activeScreen: Screen;
  setActiveScreen: (s: Screen) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeScreen, setActiveScreen }) => {
  const menuItems = [
    { id: Screen.DASHBOARD, label: 'Overview', icon: LayoutDashboard },
    { id: Screen.OPERATIONS, label: 'Operations', icon: Map },
    { id: Screen.MARKETPLACE, label: 'Black Market', icon: ShoppingCart },
    { id: Screen.RISK_POOL, label: 'Risk Pool', icon: ShieldCheck },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-slate-800 border-r border-slate-700 flex-col z-20 shadow-xl">
      <div className="p-6">
        <div className="h-8 w-8 bg-indigo-500 rounded-lg animate-pulse" />
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-indigo-200' : 'text-slate-500 group-hover:text-slate-300'} />
              <span className="font-medium tracking-wide text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="p-3 rounded bg-slate-900/50 border border-slate-700">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs text-emerald-500 font-mono">ENCRYPTED</span>
          </div>
        </div>
      </div>
    </aside>
  );
};