import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import vehicleRouter from './modules/vehicles/vehicles.routes';
import driverRouter from './modules/drivers/drivers.routes';
import tripRouter from './modules/trips/trips.routes';
import financialRouter from './modules/financials/financials.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Bind feature module router instances
app.use('/api/vehicles', vehicleRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/trips', tripRouter);
app.use('/api/financials', financialRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎯 Pure REST Engine active on port ${PORT}. Ready for client mapping.`);
});