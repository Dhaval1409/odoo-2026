import { Router } from 'express';
import { dispatchTrip, completeTrip } from './trips.controller';

const router = Router();
router.post('/dispatch', dispatchTrip);
router.post('/:id/complete', completeTrip);

export default router;