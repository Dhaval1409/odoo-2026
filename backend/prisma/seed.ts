

import 'dotenv/config';
import { PrismaClient, Role, VehicleStatus, DriverStatus, TripStatus } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcryptjs';

// ---------- Parse DATABASE_URL into adapter config ----------
const dbUrl = new URL(process.env.DATABASE_URL as string);

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: dbUrl.port ? Number(dbUrl.port) : 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.replace(/^\//, ''),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ---------- Clean existing data (order matters due to FKs) ----------
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // ---------- Users ----------
  const passwordHash = await bcrypt.hash('password123', 10);

  const users = await prisma.user.createMany({
    data: [
      { email: 'manager@transitops.com', password: passwordHash, name: 'Aditi Rao', role: Role.FLEET_MANAGER },
      { email: 'dispatcher@transitops.com', password: passwordHash, name: 'Rohan Mehta', role: Role.DISPATCHER },
      { email: 'safety@transitops.com', password: passwordHash, name: 'Kavya Nair', role: Role.SAFETY_OFFICER },
      { email: 'finance@transitops.com', password: passwordHash, name: 'Vikram Desai', role: Role.FINANCIAL_ANALYST },
    ],
  });
  console.log(`✅ Created ${users.count} users (password for all: "password123")`);

  // ---------- Vehicles ----------
  const vehicleData = [
    { registrationNo: 'GJ01AB1234', model: 'Tata Ace Gold', type: 'Mini Truck', maxLoadCapacityKg: 750, odometer: 42350, acquisitionCost: 550000, status: VehicleStatus.ON_TRIP },
    { registrationNo: 'GJ01CD5678', model: 'Ashok Leyland Dost+', type: 'Light Truck', maxLoadCapacityKg: 1250, odometer: 78210, acquisitionCost: 820000, status: VehicleStatus.AVAILABLE },
    { registrationNo: 'GJ05EF9012', model: 'Mahindra Bolero Pickup', type: 'Pickup', maxLoadCapacityKg: 1700, odometer: 15600, acquisitionCost: 950000, status: VehicleStatus.IN_SHOP },
    { registrationNo: 'MH12GH3456', model: 'Eicher Pro 2049', type: 'Medium Truck', maxLoadCapacityKg: 4900, odometer: 112430, acquisitionCost: 1650000, status: VehicleStatus.ON_TRIP },
    { registrationNo: 'MH14IJ7890', model: 'Tata 407 Gold SFC', type: 'Light Truck', maxLoadCapacityKg: 2500, odometer: 63820, acquisitionCost: 1100000, status: VehicleStatus.AVAILABLE },
    { registrationNo: 'RJ14KL2345', model: 'BharatBenz 1917R', type: 'Heavy Truck', maxLoadCapacityKg: 9000, odometer: 205100, acquisitionCost: 2900000, status: VehicleStatus.RETIRED },
  ];
  const vehicles = [];
  for (const v of vehicleData) {
    vehicles.push(await prisma.vehicle.create({ data: v }));
  }
  console.log(`✅ Created ${vehicles.length} vehicles`);

  // ---------- Drivers ----------
  const driverData = [
    { name: 'Suresh Patil', licenseNo: 'DL-GJ-2019-001122', category: 'HMV', licenseExpiry: new Date('2027-03-15'), contactNo: '9876543210', safetyScore: 92.5, status: DriverStatus.ON_TRIP },
    { name: 'Manoj Yadav', licenseNo: 'DL-GJ-2020-004455', category: 'LMV', licenseExpiry: new Date('2026-11-20'), contactNo: '9876500011', safetyScore: 88.0, status: DriverStatus.AVAILABLE },
    { name: 'Ramesh Iyer', licenseNo: 'DL-MH-2018-009988', category: 'HMV', licenseExpiry: new Date('2025-09-05'), contactNo: '9123456780', safetyScore: 76.3, status: DriverStatus.SUSPENDED },
    { name: 'Farhan Sheikh', licenseNo: 'DL-MH-2021-002233', category: 'LMV', licenseExpiry: new Date('2028-01-10'), contactNo: '9988776655', safetyScore: 95.1, status: DriverStatus.ON_TRIP },
    { name: 'Deepak Chauhan', licenseNo: 'DL-RJ-2017-007766', category: 'HMV', licenseExpiry: new Date('2026-06-30'), contactNo: '9871234560', safetyScore: 81.7, status: DriverStatus.OFF_DUTY },
    { name: 'Anil Kumar', licenseNo: 'DL-GJ-2022-003344', category: 'LMV', licenseExpiry: new Date('2029-04-18'), contactNo: '9090909090', safetyScore: 99.0, status: DriverStatus.AVAILABLE },
  ];
  const drivers = [];
  for (const d of driverData) {
    drivers.push(await prisma.driver.create({ data: d }));
  }
  console.log(`✅ Created ${drivers.length} drivers`);

  // ---------- Trips ----------
  const trips = await Promise.all([
    prisma.trip.create({
      data: {
        source: 'Ahmedabad', destination: 'Surat', cargoWeightKg: 600,
        plannedDistance: 265, actualDistance: 270, fuelConsumed: 32,
        status: TripStatus.COMPLETED, vehicleId: vehicles[0].id, driverId: drivers[0].id,
      },
    }),
    prisma.trip.create({
      data: {
        source: 'Vadodara', destination: 'Rajkot', cargoWeightKg: 1100,
        plannedDistance: 220, actualDistance: null, fuelConsumed: null,
        status: TripStatus.DISPATCHED, vehicleId: vehicles[3].id, driverId: drivers[3].id,
      },
    }),
    prisma.trip.create({
      data: {
        source: 'Mumbai', destination: 'Pune', cargoWeightKg: 2000,
        plannedDistance: 150, actualDistance: 155, fuelConsumed: 28,
        status: TripStatus.COMPLETED, vehicleId: vehicles[4].id, driverId: drivers[1].id,
      },
    }),
    prisma.trip.create({
      data: {
        source: 'Jaipur', destination: 'Udaipur', cargoWeightKg: 3200,
        plannedDistance: 400, actualDistance: null, fuelConsumed: null,
        status: TripStatus.DRAFT, vehicleId: vehicles[1].id, driverId: drivers[5].id,
      },
    }),
    prisma.trip.create({
      data: {
        source: 'Surat', destination: 'Ahmedabad', cargoWeightKg: 500,
        plannedDistance: 265, actualDistance: null, fuelConsumed: null,
        status: TripStatus.CANCELLED, vehicleId: vehicles[2].id, driverId: drivers[4].id,
      },
    }),
  ]);
  console.log(`✅ Created ${trips.length} trips`);

  // ---------- Maintenance logs ----------
  const maintenance = await Promise.all([
    prisma.maintenance.create({
      data: { description: 'Engine oil change + filter replacement', cost: 4500, startDate: new Date('2026-06-01'), endDate: new Date('2026-06-02'), isOpen: false, vehicleId: vehicles[0].id },
    }),
    prisma.maintenance.create({
      data: { description: 'Brake pad replacement', cost: 8200, startDate: new Date('2026-07-01'), endDate: null, isOpen: true, vehicleId: vehicles[2].id },
    }),
    prisma.maintenance.create({
      data: { description: 'Clutch plate overhaul', cost: 15600, startDate: new Date('2026-05-15'), endDate: new Date('2026-05-20'), isOpen: false, vehicleId: vehicles[3].id },
    }),
    prisma.maintenance.create({
      data: { description: 'Tyre replacement (all 6)', cost: 32000, startDate: new Date('2026-07-08'), endDate: null, isOpen: true, vehicleId: vehicles[5].id },
    }),
  ]);
  console.log(`✅ Created ${maintenance.length} maintenance logs`);

  // ---------- Fuel logs ----------
  const fuelLogs = await Promise.all([
    prisma.fuelLog.create({ data: { liters: 40, cost: 4200, date: new Date('2026-07-01'), vehicleId: vehicles[0].id } }),
    prisma.fuelLog.create({ data: { liters: 65, cost: 6900, date: new Date('2026-07-03'), vehicleId: vehicles[3].id } }),
    prisma.fuelLog.create({ data: { liters: 30, cost: 3150, date: new Date('2026-07-05'), vehicleId: vehicles[4].id } }),
    prisma.fuelLog.create({ data: { liters: 50, cost: 5300, date: new Date('2026-07-09'), vehicleId: vehicles[1].id } }),
    prisma.fuelLog.create({ data: { liters: 80, cost: 8500, date: new Date('2026-07-10'), vehicleId: vehicles[3].id } }),
  ]);
  console.log(`✅ Created ${fuelLogs.length} fuel logs`);

  // ---------- Expenses ----------
  const expenses = await Promise.all([
    prisma.expense.create({ data: { type: 'Toll', amount: 850, date: new Date('2026-07-01'), vehicleId: vehicles[0].id } }),
    prisma.expense.create({ data: { type: 'Parking', amount: 200, date: new Date('2026-07-02'), vehicleId: vehicles[4].id } }),
    prisma.expense.create({ data: { type: 'Insurance Premium', amount: 12500, date: new Date('2026-06-15'), vehicleId: vehicles[3].id } }),
    prisma.expense.create({ data: { type: 'RTO Fine', amount: 1500, date: new Date('2026-06-28'), vehicleId: vehicles[2].id } }),
    prisma.expense.create({ data: { type: 'Toll', amount: 620, date: new Date('2026-07-09'), vehicleId: vehicles[1].id } }),
  ]);
  console.log(`✅ Created ${expenses.length} expenses`);

  console.log('🎉 Seeding complete!');
  console.log('   Login with: manager@transitops.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });