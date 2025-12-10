export enum Screen {
  DASHBOARD = 'DASHBOARD',
  OPERATIONS = 'OPERATIONS',
  MARKETPLACE = 'MARKETPLACE',
  RISK_POOL = 'RISK_POOL',
}

export enum CommodityType {
  FENTALYTE = 'Fentalyte',
  COCAETHER = 'Cocaether',
  METHRAX = 'Methrax',
  HERONA = 'Herona',
}

export enum RouteType {
  SOUTHWEST_MEGAPORT = 'Southwest Megaport',
  NORTHERN_CROSSING = 'Northern Crossing',
  MARITIME_BLUE_ZONE = 'Maritime Blue Zone',
  AIR_FREIGHT = 'Air Freight',
}

export enum StrategyType {
  STANDARD = 'Standard Run',
  SHOTGUN = 'Shotgun Spread',
  DECOY = 'Decoy Operation',
  PREMIUM_CONCEALMENT = 'Premium Concealment',
}

export interface Commodity {
  id: CommodityType;
  name: string;
  description: string;
  baseCost: number;
  baseSellPrice: number;
  volatility: number; // 0-1, how much price fluctuates
  riskProfile: number; // 0-1, inherent risk
  weight: number; // impact on logistics
}

export interface Shipment {
  id: string;
  commodity: CommodityType;
  amount: number;
  route: RouteType;
  strategy: StrategyType;
  progress: number; // 0-100
  risk: number; // 0-100 probability of seizure
  potentialRevenue: number;
  cost: number;
  status: 'planning' | 'in-transit' | 'delivered' | 'seized' | 'partial-loss';
  log: string[];
}

export interface RouteStats {
  heat: number; // 0-100, increases with use
  efficiency: number; // 0-100, decreases with heat
}

export interface GameState {
  money: number;
  riskPoolBalance: number;
  day: number;
  globalHeat: number;
  inventory: Record<CommodityType, number>;
  activeShipments: Shipment[];
  shipmentHistory: Shipment[];
  routeStats: Record<RouteType, RouteStats>;
  marketPrices: Record<CommodityType, number>;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}
