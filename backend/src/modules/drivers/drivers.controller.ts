import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export const registerDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, licenseNo, category, licenseExpiry, contactNo } = req.body;

    const existing = await prisma.driver.findUnique({ where: { licenseNo } });
    if (existing) {
      res.status(400).json({ error: "License identity number already exists." });
      return;
    }

    const driver = await prisma.driver.create({
      data: { name, licenseNo, category, licenseExpiry: new Date(licenseExpiry), contactNo }
    });
    res.status(201).json(driver);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};