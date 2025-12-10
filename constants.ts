import { Commodity, CommodityType, GameState, RouteType } from "./types";

export const COMMODITIES: Record<CommodityType, Commodity> = {
  [CommodityType.FENTALYTE]: {
    id: CommodityType.FENTALYTE,
    name: 'Fentalyte',
    description: 'Ultra-potent, microscopic weight. High detection risk, extreme reward.',
    baseCost: 200,
    baseSellPrice: 1500,
    volatility: 0.8,
    riskProfile: 0.9,
    weight: 0.1,
  },
  [CommodityType.COCAETHER]: {
    id: CommodityType.COCAETHER,
    name: 'Cocaether',
    description: 'Bulk maritime cargo. High volume required for profit.',
    baseCost: 50,
    baseSellPrice: 300,
    volatility: 0.3,
    riskProfile: 0.4,
    weight: 1.0,
  },
  [CommodityType.METHRAX]: {
    id: CommodityType.METHRAX,
    name: 'Methrax Crystals',
    description: 'Cheap to manufacture, floods the map. Volume dependent.',
    baseCost: 20,
    baseSellPrice: 80,
    volatility: 0.1,
    riskProfile: 0.3,
    weight: 0.8,
  },
  [CommodityType.HERONA]: {
    id: CommodityType.HERONA,
    name: 'Herona',
    description: 'Legacy commodity. Stable prices, moderate risk.',
    baseCost: 100,
    baseSellPrice: 450,
    volatility: 0.2,
    riskProfile: 0.5,
    weight: 0.5,
  },
};

export const ROUTE_CONFIG: Record<RouteType, { baseRisk: number; speed: number; description: string }> = {
  [RouteType.SOUTHWEST_MEGAPORT]: { 
    baseRisk: 0.4, 
    speed: 20, // progress per tick
    description: 'High volume, high canine presence. Fast but dangerous.' 
  },
  [RouteType.NORTHERN_CROSSING]: { 
    baseRisk: 0.2, 
    speed: 10,
    description: 'Strict paperwork, low traffic. Slower processing.'
  },
  [RouteType.MARITIME_BLUE_ZONE]: { 
    baseRisk: 0.6, 
    speed: 5,
    description: 'Aerial radar patrols. Slow moving, huge capacity.'
  },
  [RouteType.AIR_FREIGHT]: { 
    baseRisk: 0.8, 
    speed: 40,
    description: 'Randomized scanning. extremely fast, extremely risky.'
  },
};

export const INITIAL_STATE: GameState = {
  money: 50000,
  riskPoolBalance: 10000,
  day: 1,
  globalHeat: 10,
  inventory: {
    [CommodityType.FENTALYTE]: 10,
    [CommodityType.COCAETHER]: 100,
    [CommodityType.METHRAX]: 500,
    [CommodityType.HERONA]: 50,
  },
  activeShipments: [],
  shipmentHistory: [],
  routeStats: {
    [RouteType.SOUTHWEST_MEGAPORT]: { heat: 0, efficiency: 100 },
    [RouteType.NORTHERN_CROSSING]: { heat: 0, efficiency: 100 },
    [RouteType.MARITIME_BLUE_ZONE]: { heat: 0, efficiency: 100 },
    [RouteType.AIR_FREIGHT]: { heat: 0, efficiency: 100 },
  },
  marketPrices: {
    [CommodityType.FENTALYTE]: 1500,
    [CommodityType.COCAETHER]: 300,
    [CommodityType.METHRAX]: 80,
    [CommodityType.HERONA]: 450,
  },
  notifications: [
    { id: 'init', title: 'System Online', message: 'Welcome to the network, Boss.', type: 'info', timestamp: Date.now() }
  ],
};