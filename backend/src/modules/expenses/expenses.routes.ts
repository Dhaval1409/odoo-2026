import { Router } from 'express';
import { createExpense, getExpenses } from './expenses.controller';

const router = Router();

router.post('/', createExpense);
router.get('/', getExpenses);

export default router;
