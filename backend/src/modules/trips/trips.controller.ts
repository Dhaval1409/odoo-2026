import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export const dispatchTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const { source, destination, cargoWeightKg, plannedDistance, vehicleId, driverId } = req.body;

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    const driver = await prisma.driver.findUnique({ where: { id: driverId } });

    if (!vehicle || vehicle.status !== 'AVAILABLE') {
      res.status(400).json({ error: 'Vehicle asset is not in an AVAILABLE pool.' });
      return;
    }
    if (!driver || driver.status !== 'AVAILABLE') {
      res.status(400).json({ error: 'Driver is not status AVAILABLE or does not exist.' });
      return;
    }
    if (new Date(driver.licenseExpiry) < new Date()) {
      res.status(400).json({ error: 'Driver assignment denied: License has expired.' });
      return;
    }
    if (cargoWeightKg > vehicle.maxLoadCapacityKg) {
      res.status(400).json({ error: 'Cargo weight deployment exceeds vehicle capacity payload constraints.' });
      return;
    }

    const trip = await prisma.$transaction(async (tx: any) => {
      await tx.vehicle.update({ where: { id: vehicleId }, data: { status: 'ON_TRIP' } });
      await tx.driver.update({ where: { id: driverId }, data: { status: 'ON_TRIP' } });

      return await tx.trip.create({
        data: { source, destination, cargoWeightKg, plannedDistance, vehicleId, driverId, status: 'DISPATCHED' }
      });
    });

    res.status(201).json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const completeTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { finalOdometer, fuelConsumed, fuelCost } = req.body;

    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) {
      res.status(404).json({ error: 'Trip context parameter reference not found.' });
      return;
    }

    await prisma.$transaction(async (tx: any) => {
      await tx.trip.update({
        where: { id },
        data: { status: 'COMPLETED', actualDistance: finalOdometer, fuelConsumed }
      });
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: 'AVAILABLE', odometer: finalOdometer }
      });
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: 'AVAILABLE' }
      });
      await tx.fuelLog.create({
        data: { liters: fuelConsumed, cost: fuelCost, vehicleId: trip.vehicleId }
      });
    });

    res.status(200).json({ message: 'Trip transaction resolved and finalized successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};  