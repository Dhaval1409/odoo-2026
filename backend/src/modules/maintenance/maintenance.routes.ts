import { Router } from 'express';
import { createMaintenance, closeMaintenance, getMaintenanceLogs } from './maintenance.controller';

const router = Router();

router.post('/', createMaintenance);
router.get('/', getMaintenanceLogs);
router.post('/:id/close', closeMaintenance);

export default router;
