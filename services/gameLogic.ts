import { GameState, Shipment, RouteType, StrategyType, CommodityType, Notification } from '../types';
import { ROUTE_CONFIG, COMMODITIES } from '../constants';

// Helper to create notifications
const createNotification = (title: string, message: string, type: Notification['type']): Notification => ({
  id: Math.random().toString(36).substring(7),
  title,
  message,
  type,
  timestamp: Date.now(),
});

export const calculateRisk = (
  commodity: CommodityType,
  route: RouteType,
  strategy: StrategyType,
  amount: number,
  currentRouteHeat: number
): number => {
  const commConfig = COMMODITIES[commodity];
  const routeConfig = ROUTE_CONFIG[route];

  let risk = routeConfig.baseRisk * 0.4 + commConfig.riskProfile * 0.4;
  
  // Heat Factor: More heat = exponentially more risk
  risk += (currentRouteHeat / 100) * 0.5;

  // Volume Factor: Larger shipments are harder to hide
  if (amount > 100) risk += 0.1;
  if (amount > 1000) risk += 0.2;

  // Drones have almost no volume risk if small amount
  if (route === RouteType.LOW_ALTITUDE_DRONE && amount <= 10) {
      risk = 0.05; // 5% flat risk
  }

  // Strategy Modifiers
  switch (strategy) {
    case StrategyType.SHOTGUN:
      risk *= 0.7; 
      break;
    case StrategyType.DECOY:
      risk *= 0.4;
      break;
    case StrategyType.PREMIUM_CONCEALMENT:
      risk *= 0.6;
      break;
    case StrategyType.STANDARD:
    default:
      break;
  }

  return Math.min(Math.max(risk, 0.01), 0.99); // Clamp between 1% and 99%
};

export const processGameTick = (state: GameState): GameState => {
  let newState = { ...state };
  let newNotifications = [...state.notifications];

  // 1. Process Active Shipments
  const completedShipments: Shipment[] = [];
  const remainingShipments: Shipment[] = [];

  newState.activeShipments.forEach(shipment => {
    // Increase progress
    const routeSpeed = ROUTE_CONFIG[shipment.route].speed;
    // Efficiency penalty based on heat
    const efficiencyMod = newState.routeStats[shipment.route].efficiency / 100;
    
    shipment.progress += routeSpeed * efficiencyMod * (Math.random() * 0.5 + 0.75); // Random flux

    if (shipment.progress >= 100) {
      shipment.progress = 100;
      // Resolve Shipment
      const roll = Math.random();
      
      if (roll < shipment.risk) {
        // SEIZURE
        shipment.status = 'seized';
        
        // Risk Pool Logic
        let covered = 0;
        if (newState.riskPoolBalance > 0) {
          const coverageAmt = Math.min(shipment.cost, newState.riskPoolBalance);
          newState.riskPoolBalance -= coverageAmt;
          newState.money += coverageAmt;
          covered = coverageAmt;
        }

        newNotifications.push(createNotification(
          'SHIPMENT SEIZED', 
          `Route ${shipment.route} intercepted. Lost ${shipment.amount} units. ${covered > 0 ? `Insured $${covered}.` : ''}`,
          'error'
        ));

        // Increase Heat drastically
        newState.routeStats[shipment.route].heat = Math.min(100, newState.routeStats[shipment.route].heat + 15);

      } else {
        // SUCCESS
        shipment.status = 'delivered';
        newState.money += shipment.potentialRevenue;
        
        // Reputation Gain
        const repGain = Math.floor(shipment.potentialRevenue / 100);
        newState.reputation += repGain;

        // Level Up Check
        const nextLevelThreshold = newState.level * 1000;
        if (newState.reputation >= nextLevelThreshold) {
            newState.level += 1;
            newNotifications.push(createNotification(
                'EMPIRE EXPANSION',
                `Organization reached Tier ${newState.level}. New contacts available.`,
                'success'
            ));
        }

        newNotifications.push(createNotification(
          'PAYOUT RECEIVED', 
          `Shipment delivered via ${shipment.route}. +$${shipment.potentialRevenue.toLocaleString()} | +${repGain} REP`,
          'success'
        ));
        
        // Slight Heat Increase (Drones generate 0 heat)
        if (shipment.route !== RouteType.LOW_ALTITUDE_DRONE) {
             newState.routeStats[shipment.route].heat = Math.min(100, newState.routeStats[shipment.route].heat + 5);
        }
      }
      
      completedShipments.push(shipment);
    } else {
      remainingShipments.push(shipment);
    }
  });

  newState.activeShipments = remainingShipments;
  newState.shipmentHistory = [...completedShipments, ...newState.shipmentHistory];

  // 2. Process Route Stats (Cooldown)
  Object.keys(newState.routeStats).forEach(key => {
    const route = key as RouteType;
    // Heat cools down slowly
    if (newState.routeStats[route].heat > 0) {
      newState.routeStats[route].heat = Math.max(0, newState.routeStats[route].heat - 0.2);
    }
    // Efficiency is inverse of heat
    newState.routeStats[route].efficiency = 100 - (newState.routeStats[route].heat * 0.5);
  });

  // 3. Market Fluctuations (Every 10 ticks approx)
  if (Math.random() < 0.1) {
    Object.keys(newState.marketPrices).forEach(key => {
      const commType = key as CommodityType;
      const volatility = COMMODITIES[commType].volatility;
      const basePrice = COMMODITIES[commType].baseSellPrice;
      
      const flux = (Math.random() - 0.5) * 2 * volatility * basePrice * 0.2; // +/- 20% scaled by volatility
      newState.marketPrices[commType] = Math.max(basePrice * 0.5, newState.marketPrices[commType] + flux);
    });
  }

  // Trim notifications
  if (newNotifications.length > 20) {
    newNotifications = newNotifications.slice(newNotifications.length - 20);
  }
  newState.notifications = newNotifications;

  return newState;
};