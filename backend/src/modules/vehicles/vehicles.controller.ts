import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export const registerVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationNo, model, type, maxLoadCapacityKg, odometer, acquisitionCost } = req.body;

    const existing = await prisma.vehicle.findUnique({ where: { registrationNo } });
    if (existing) {
      res.status(400).json({ error: "Registration number must be unique." });
      return;
    }

    const vehicle = await prisma.vehicle.create({
      data: { registrationNo, model, type, maxLoadCapacityKg, odometer, acquisitionCost }
    });
    res.status(201).json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicles = await prisma.vehicle.findMany();
    res.status(200).json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};