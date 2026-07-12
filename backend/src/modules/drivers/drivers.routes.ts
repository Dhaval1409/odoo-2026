import { Router } from 'express';
import { registerDriver } from './drivers.controller';

const router = Router();
router.post('/', registerDriver);

export default router;