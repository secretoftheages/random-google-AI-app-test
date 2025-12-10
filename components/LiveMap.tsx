import React from 'react';
import { Truck, Ship, Plane, Bot, Fan, Crosshair, Navigation } from 'lucide-react';
import { Shipment, RouteType } from '../types';

const ROUTE_PATHS: Record<RouteType, string> = {
  [RouteType.SOUTHWEST_MEGAPORT]: "M 50 300 C 150 250, 300 280, 550 300", 
  [RouteType.NORTHERN_CROSSING]: "M 50 100 C 200 80, 400 120, 600 100",
  [RouteType.MARITIME_BLUE_ZONE]: "M 50 400 C 200 500, 500 450, 750 350",
  [RouteType.AIR_FREIGHT]: "M 50 200 C 300 50, 500 150, 800 200",
  [RouteType.LOW_ALTITUDE_DRONE]: "M 100 250 C 300 250, 400 250, 600 250",
  [RouteType.VIP_HELICOPTER]: "M 50 50 L 750 300",
};

export const LiveMap = ({ shipments }: { shipments: Shipment[] }) => {
  return (
    <div className="relative w-full h-80 lg:h-96 bg-slate-950 border border-slate-700 rounded-xl overflow-hidden shadow-2xl group select-none">
      {/* Background Grid / Map Texture */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Decorative Map Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-slate-800 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 border border-indigo-900/30 rounded-full"></div>
      
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        {/* Draw Route Lines */}
        {Object.entries(ROUTE_PATHS).map(([route, d]) => (
          <path key={route} d={d} stroke="#334155" strokeWidth="2" fill="none" strokeDasharray="4,4" className="opacity-50" />
        ))}

        {/* Draw Moving Units */}
        {shipments.map((shipment) => {
          const isPlane = shipment.route === RouteType.AIR_FREIGHT;
          const isShip = shipment.route === RouteType.MARITIME_BLUE_ZONE;
          const isDrone = shipment.route === RouteType.LOW_ALTITUDE_DRONE;
          const isHeli = shipment.route === RouteType.VIP_HELICOPTER;
          
          return (
            <g key={shipment.id}>
              <foreignObject 
                width="24" height="24"
                style={{
                  offsetPath: `path("${ROUTE_PATHS[shipment.route]}")`,
                  offsetDistance: `${shipment.progress}%`,
                  transition: 'offset-distance 1s linear'
                }}
                className="overflow-visible"
              >
                <div className={`p-1 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.6)] flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 ${
                   shipment.status === 'seized' ? 'bg-red-500 animate-ping' : 
                   isDrone ? 'bg-emerald-500' :
                   isHeli ? 'bg-amber-500' :
                   'bg-indigo-500'
                }`}>
                  {isPlane ? <Plane size={14} className="text-white transform -rotate-45" /> : 
                   isShip ? <Ship size={14} className="text-white" /> :
                   isDrone ? <Bot size={14} className="text-white" /> :
                   isHeli ? <Fan size={14} className="text-white animate-spin-slow" /> :
                   <Truck size={14} className="text-white" />}
                </div>
                {/* Ping Effect Trail */}
                <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-indigo-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping" />
              </foreignObject>
            </g>
          );
        })}
      </svg>
      
      {/* HUD Elements */}
      <div className="absolute top-4 left-4 text-[10px] font-mono text-indigo-400 flex items-center gap-2">
        <Crosshair size={14} className="animate-spin-slow" /> SAT_UPLINK_ESTABLISHED
      </div>
      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-500 flex items-center gap-2">
        <Navigation size={14} /> SECTOR_7G [ACTIVE]
      </div>
    </div>
  );
};