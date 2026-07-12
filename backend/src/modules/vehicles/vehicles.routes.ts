import { Router } from 'express';
import { registerVehicle, getVehicles } from './vehicles.controller';

const router = Router();
router.post('/', registerVehicle);
router.get('/', getVehicles);

export default router;