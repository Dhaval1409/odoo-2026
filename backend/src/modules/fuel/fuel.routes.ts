import { Router } from 'express';
import { createFuelLog, getFuelLogs } from './fuel.controller';

const router = Router();

router.post('/', createFuelLog);
router.get('/', getFuelLogs);

export default router;
