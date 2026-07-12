import { Router } from 'express';
import { listTrips, dispatchTrip, completeTrip, cancelTrip } from './trips.controller';

const router = Router();

router.get('/', listTrips);
router.post('/dispatch', dispatchTrip);
router.post('/:id/complete', completeTrip);
router.post('/:id/cancel', cancelTrip);

export default router;