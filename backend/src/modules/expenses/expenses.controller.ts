import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export const createExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, amount, date, vehicleId } = req.body;

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found.' });
      return;
    }

    const expense = await prisma.expense.create({
      data: {
        type,
        amount,
        date: date ? new Date(date) : new Date(),
        vehicleId
      }
    });

    res.status(201).json(expense);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vehicleId } = req.query;
    const expenses = await prisma.expense.findMany({
      where: vehicleId ? { vehicleId: String(vehicleId) } : undefined,
      include: { vehicle: true },
      orderBy: { date: 'desc' }
    });
    res.status(200).json(expenses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
