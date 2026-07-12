import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export const getMetricsAndAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalVehicles = await prisma.vehicle.count();
    const activeVehicles = await prisma.vehicle.count({ where: { status: 'ON_TRIP' } });
    const maintenanceVehicles = await prisma.vehicle.count({ where: { status: 'IN_SHOP' } });

    const fuelAggregates = await prisma.fuelLog.aggregate({ _sum: { cost: true, liters: true } });
    const maintenanceAggregates = await prisma.maintenance.aggregate({ _sum: { cost: true } });

    const operationalCost = (fuelAggregates._sum.cost || 0) + (maintenanceAggregates._sum.cost || 0);
    const utilizationRate = totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0;

    res.status(200).json({
      summaryKPIs: {
        totalVehicles,
        activeVehicles,
        maintenanceVehicles,
        fleetUtilizationPercentage: utilizationRate.toFixed(2)
      },
      financialLedger: {
        aggregateFuelCost: fuelAggregates._sum.cost || 0,
        aggregateMaintenanceCost: maintenanceAggregates._sum.cost || 0,
        totalCalculatedOperationalCost: operationalCost
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

  export default getMetricsAndAnalytics;