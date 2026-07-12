import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import vehicleRouter from './modules/vehicles/vehicles.routes';
import driverRouter from './modules/drivers/drivers.routes';
import authRouter from "./modules/auth/auth.routes";
import tripRouter from './modules/trips/trips.routes';
import financialRouter from './modules/financials/financials.routes';
import fuelRouter from './modules/fuel/fuel.routes';
import expenseRouter from './modules/expenses/expenses.routes';
import maintenanceRouter from './modules/maintenance/maintenance.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Bind feature module router instances
app.use('/api/auth', authRouter);
app.use('/api/vehicles', vehicleRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/trips', tripRouter);
app.use('/api/financials', financialRouter);
app.use('/api/fuel-logs', fuelRouter);
app.use('/api/expenses', expenseRouter);
app.use('/api/maintenance', maintenanceRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎯 Pure REST Engine active on port ${PORT}. Ready for client mapping.`);
});