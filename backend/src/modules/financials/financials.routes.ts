import { Router } from 'express';
import { getMetricsAndAnalytics } from './financials.controller';

const router = Router();
router.get('/analytics', getMetricsAndAnalytics);

export default router;