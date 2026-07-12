import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// GET /api/drivers
export const listDrivers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(drivers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/drivers/:id
export const getDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const driver = await prisma.driver.findUnique({ where: { id } });
    if (!driver) {
      res.status(404).json({ error: 'Driver not found.' });
      return;
    }
    res.status(200).json(driver);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/drivers
export const registerDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, licenseNo, category, licenseExpiry, contactNo } = req.body;

    if (!name || !licenseNo || !category || !licenseExpiry || !contactNo) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }

    const existing = await prisma.driver.findUnique({ where: { licenseNo } });
    if (existing) {
      res.status(400).json({ error: 'License identity number already exists.' });
      return;
    }

    const driver = await prisma.driver.create({
      data: {
        name,
        licenseNo,
        category,
        licenseExpiry: new Date(licenseExpiry),
        contactNo,
      },
    });
    res.status(201).json(driver);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};