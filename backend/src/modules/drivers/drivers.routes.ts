import { Router } from 'express';
import { listDrivers, getDriver, registerDriver } from './drivers.controller';

const router = Router();

router.get('/', listDrivers);
router.get('/:id', getDriver);
router.post('/', registerDriver);

export default router;