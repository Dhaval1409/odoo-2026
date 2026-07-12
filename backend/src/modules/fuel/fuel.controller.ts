import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export const createFuelLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { liters, cost, date, vehicleId } = req.body;

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found.' });
      return;
    }

    const fuelLog = await prisma.fuelLog.create({
      data: {
        liters,
        cost,
        date: date ? new Date(date) : new Date(),
        vehicleId
      }
    });

    res.status(201).json(fuelLog);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getFuelLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vehicleId } = req.query;
    const logs = await prisma.fuelLog.findMany({
      where: vehicleId ? { vehicleId: String(vehicleId) } : undefined,
      include: { vehicle: true },
      orderBy: { date: 'desc' }
    });
    res.status(200).json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
