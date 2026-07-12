import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// Create a maintenance record -> vehicle automatically becomes IN_SHOP,
// removing it from the dispatch/driver selection pool.
export const createMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { description, cost, vehicleId } = req.body;

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found.' });
      return;
    }
    if (vehicle.status === 'ON_TRIP') {
      res.status(400).json({ error: 'Cannot open a maintenance log for a vehicle that is currently on a trip.' });
      return;
    }
    if (vehicle.status === 'RETIRED') {
      res.status(400).json({ error: 'Cannot open a maintenance log for a retired vehicle.' });
      return;
    }

    const maintenance = await prisma.$transaction(async (tx: any) => {
      await tx.vehicle.update({ where: { id: vehicleId }, data: { status: 'IN_SHOP' } });
      return await tx.maintenance.create({
        data: { description, cost, vehicleId, isOpen: true }
      });
    });

    res.status(201).json(maintenance);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Close a maintenance record -> vehicle restored to AVAILABLE (unless retired)
export const closeMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const maintenance = await prisma.maintenance.findUnique({ where: { id } });
    if (!maintenance) {
      res.status(404).json({ error: 'Maintenance record not found.' });
      return;
    }
    if (!maintenance.isOpen) {
      res.status(400).json({ error: 'This maintenance record is already closed.' });
      return;
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: maintenance.vehicleId } });

    const updated = await prisma.$transaction(async (tx: any) => {
      const closedRecord = await tx.maintenance.update({
        where: { id },
        data: { isOpen: false, endDate: new Date() }
      });

      if (vehicle && vehicle.status !== 'RETIRED') {
        await tx.vehicle.update({ where: { id: maintenance.vehicleId }, data: { status: 'AVAILABLE' } });
      }

      return closedRecord;
    });

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMaintenanceLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vehicleId } = req.query;
    const logs = await prisma.maintenance.findMany({
      where: vehicleId ? { vehicleId: String(vehicleId) } : undefined,
      include: { vehicle: true },
      orderBy: { startDate: 'desc' }
    });
    res.status(200).json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
