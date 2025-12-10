import { Commodity, CommodityType, GameState, RouteType, TechNode } from "./types";

export const COMMODITIES: Record<CommodityType, Commodity> = {
  [CommodityType.METHRAX]: {
    id: CommodityType.METHRAX,
    name: 'Methrax Crystals',
    description: 'Cheap to manufacture, floods the map. Volume dependent.',
    baseCost: 20,
    baseSellPrice: 80,
    volatility: 0.1,
    riskProfile: 0.3,
    weight: 0.8,
    requiredLevel: 1,
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
    requiredLevel: 2,
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
    requiredLevel: 5,
  },
  [CommodityType.FENTALYTE]: {
    id: CommodityType.FENTALYTE,
    name: 'Fentalyte',
    description: 'Ultra-potent, microscopic weight. High detection risk, extreme reward.',
    baseCost: 200,
    baseSellPrice: 1500,
    volatility: 0.8,
    riskProfile: 0.9,
    weight: 0.1,
    requiredLevel: 8,
  },
};

export const ROUTE_CONFIG: Record<RouteType, { baseRisk: number; speed: number; description: string; type: 'land' | 'sea' | 'air' }> = {
  [RouteType.SOUTHWEST_MEGAPORT]: { 
    baseRisk: 0.4, 
    speed: 15,
    description: 'High volume, high canine presence. Fast but dangerous.',
    type: 'land'
  },
  [RouteType.NORTHERN_CROSSING]: { 
    baseRisk: 0.2, 
    speed: 8,
    description: 'Strict paperwork, low traffic. Slower processing.',
    type: 'land'
  },
  [RouteType.MARITIME_BLUE_ZONE]: { 
    baseRisk: 0.5, 
    speed: 4,
    description: 'Aerial radar patrols. Slow moving, huge capacity.',
    type: 'sea'
  },
  [RouteType.AIR_FREIGHT]: { 
    baseRisk: 0.8, 
    speed: 35,
    description: 'Randomized scanning. extremely fast, extremely risky.',
    type: 'air'
  },
  [RouteType.LOW_ALTITUDE_DRONE]: { 
    baseRisk: 0.1, 
    speed: 25,
    description: 'Stealth corridor. Very low capacity, near zero heat.',
    type: 'air'
  },
  [RouteType.VIP_HELICOPTER]: { 
    baseRisk: 0.3, 
    speed: 50,
    description: 'Ignores border queues. Expensive, high speed vip transport.',
    type: 'air'
  },
};

export const TECH_TREE_NODES: TechNode[] = [
  {
    id: 'basic_logistics',
    name: 'Basic Logistics',
    description: 'Standard trucking routes.',
    cost: 0,
    unlocksRoute: RouteType.SOUTHWEST_MEGAPORT,
    icon: 'Truck'
  },
  {
    id: 'northern_expansion',
    name: 'Northern Expansion',
    description: 'Unlock Northern Crossing routes.',
    cost: 2000,
    unlocksRoute: RouteType.NORTHERN_CROSSING,
    parentId: 'basic_logistics',
    icon: 'Map'
  },
  {
    id: 'maritime_contacts',
    name: 'Maritime Contacts',
    description: 'Access to shipping lanes and port authorities.',
    cost: 15000,
    unlocksRoute: RouteType.MARITIME_BLUE_ZONE,
    parentId: 'basic_logistics',
    icon: 'Ship'
  },
  {
    id: 'air_strip',
    name: 'Private Air Strip',
    description: 'Buy a shell aviation company.',
    cost: 40000,
    unlocksRoute: RouteType.AIR_FREIGHT,
    parentId: 'maritime_contacts',
    icon: 'Plane'
  },
  {
    id: 'drone_tech',
    name: 'Radar Jamming',
    description: 'Unlock Drone Corridors.',
    cost: 75000,
    unlocksRoute: RouteType.LOW_ALTITUDE_DRONE,
    parentId: 'air_strip',
    icon: 'Bot'
  },
  {
    id: 'chopper_access',
    name: 'Executive Transport',
    description: 'Unlock VIP Helicopter routes.',
    cost: 120000,
    unlocksRoute: RouteType.VIP_HELICOPTER,
    parentId: 'drone_tech',
    icon: 'Fan'
  }
];

export const INITIAL_STATE: GameState = {
  money: 5000,
  riskPoolBalance: 0,
  reputation: 0,
  level: 1,
  day: 1,
  globalHeat: 10,
  inventory: {
    [CommodityType.FENTALYTE]: 0,
    [CommodityType.COCAETHER]: 0,
    [CommodityType.METHRAX]: 100,
    [CommodityType.HERONA]: 0,
  },
  activeShipments: [],
  shipmentHistory: [],
  routeStats: {
    [RouteType.SOUTHWEST_MEGAPORT]: { heat: 0, efficiency: 100 },
    [RouteType.NORTHERN_CROSSING]: { heat: 0, efficiency: 100 },
    [RouteType.MARITIME_BLUE_ZONE]: { heat: 0, efficiency: 100 },
    [RouteType.AIR_FREIGHT]: { heat: 0, efficiency: 100 },
    [RouteType.LOW_ALTITUDE_DRONE]: { heat: 0, efficiency: 100 },
    [RouteType.VIP_HELICOPTER]: { heat: 0, efficiency: 100 },
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
  unlockedTechs: ['basic_logistics']
};