const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('transitops_token');
}

export function setToken(token: string) {
  window.localStorage.setItem('transitops_token', token);
}

export function clearToken() {
  window.localStorage.removeItem('transitops_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await res.json() : null;

  if (!res.ok) {
    const message = body?.error || `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return body as T;
}

const get = <T>(path: string) => request<T>(path, { method: 'GET' });
const post = <T>(path: string, data?: unknown) =>
  request<T>(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined });

// ---------- Types ----------

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'FLEET_MANAGER' | 'DISPATCHER' | 'SAFETY_OFFICER' | 'FINANCIAL_ANALYST';
}

export interface Vehicle {
  id: string;
  registrationNo: string;
  model: string;
  type: string;
  maxLoadCapacityKg: number;
  odometer: number;
  acquisitionCost: number;
  status: 'AVAILABLE' | 'ON_TRIP' | 'IN_SHOP' | 'RETIRED';
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNo: string;
  category: string;
  licenseExpiry: string;
  contactNo: string;
  safetyScore: number;
  status: 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED';
  createdAt: string;
}

export interface Trip {
  id: string;
  source: string;
  destination: string;
  cargoWeightKg: number;
  plannedDistance: number;
  actualDistance: number | null;
  fuelConsumed: number | null;
  status: 'DRAFT' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';
  vehicleId: string;
  driverId: string;
  vehicle?: Vehicle;
  driver?: Driver;
  createdAt: string;
}

export interface MaintenanceLog {
  id: string;
  description: string;
  cost: number;
  startDate: string;
  endDate: string | null;
  isOpen: boolean;
  vehicleId: string;
  vehicle?: Vehicle;
}

export interface FuelLog {
  id: string;
  liters: number;
  cost: number;
  date: string;
  vehicleId: string;
  vehicle?: Vehicle;
}

export interface Expense {
  id: string;
  type: string;
  amount: number;
  date: string;
  vehicleId: string;
  vehicle?: Vehicle;
}

export interface Analytics {
  summaryKPIs: {
    totalVehicles: number;
    activeVehicles: number;
    maintenanceVehicles: number;
    fleetUtilizationPercentage: string;
  };
  financialLedger: {
    aggregateFuelCost: number;
    aggregateMaintenanceCost: number;
    totalCalculatedOperationalCost: number;
  };
}

// ---------- Auth ----------

export const authApi = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    post<{ user: User; token: string }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    post<{ user: User; token: string }>('/auth/login', data),
  me: () => get<User>('/auth/me'),
};

// ---------- Vehicles ----------

export const vehiclesApi = {
  list: () => get<Vehicle[]>('/vehicles'),
  get: (id: string) => get<Vehicle>(`/vehicles/${id}`),
  create: (data: Partial<Vehicle>) => post<Vehicle>('/vehicles', data),
  retire: (id: string) => post<Vehicle>(`/vehicles/${id}/retire`),
};

// ---------- Drivers ----------

export const driversApi = {
  list: () => get<Driver[]>('/drivers'),
  get: (id: string) => get<Driver>(`/drivers/${id}`),
  create: (data: Partial<Driver>) => post<Driver>('/drivers', data),
};

// ---------- Trips ----------

export const tripsApi = {
  list: () => get<Trip[]>('/trips'),
  dispatch: (data: { source: string; destination: string; cargoWeightKg: number; plannedDistance: number; vehicleId: string; driverId: string }) =>
    post<Trip>('/trips/dispatch', data),
  complete: (id: string, data: { finalOdometer: number; fuelConsumed: number; fuelCost: number }) =>
    post<{ message: string }>(`/trips/${id}/complete`, data),
  cancel: (id: string) => post<Trip>(`/trips/${id}/cancel`),
};

// ---------- Maintenance ----------

export const maintenanceApi = {
  list: () => get<MaintenanceLog[]>('/maintenance'),
  create: (data: { description: string; cost: number; vehicleId: string }) =>
    post<MaintenanceLog>('/maintenance', data),
  close: (id: string) => post<MaintenanceLog>(`/maintenance/${id}/close`),
};

// ---------- Fuel logs ----------

export const fuelApi = {
  list: () => get<FuelLog[]>('/fuel-logs'),
  create: (data: { liters: number; cost: number; vehicleId: string }) =>
    post<FuelLog>('/fuel-logs', data),
};

// ---------- Expenses ----------

export const expensesApi = {
  list: () => get<Expense[]>('/expenses'),
  create: (data: { type: string; amount: number; vehicleId: string }) =>
    post<Expense>('/expenses', data),
};

// ---------- Financials ----------

export const financialsApi = {
  analytics: () => get<Analytics>('/financials/analytics'),
};
