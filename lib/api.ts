import { mockAppointments, mockBranches, mockClients, mockEmployees, mockProducts, mockServices, mockTransactions, mockCompanies } from "./mock-data";

// Simulated delay to mimic network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ── LOCAL STORAGE ENGINE ──

// Bump this version any time the mock data changes significantly.
// It forces all cached localStorage keys to be reset to the fresh mock data.
const SEED_VERSION = "v5"; // bump when mock-data.ts changes

function checkAndSeedVersion() {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem('fenix_seed_version');
  if (stored !== SEED_VERSION) {
    // Clear all mock data so it gets re-seeded from the updated mock
    ['companies', 'branches', 'appointments', 'services', 'employees', 'clients', 'transactions', 'products'].forEach(key => {
      localStorage.removeItem(`fenix_mock_${key}`);
    });
    localStorage.setItem('fenix_seed_version', SEED_VERSION);
  }
}

// Run seed check immediately when this module loads (client side)
if (typeof window !== 'undefined') {
  checkAndSeedVersion();
}

function reviver(_key: string, value: any) {
  // Revive ISO date strings to Date objects
  const isDateStr = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
  if (isDateStr) return new Date(value);
  return value;
}

function loadLocal<T>(key: string, defaultData: T): T {
  if (typeof window === 'undefined') return defaultData;
  try {
    const stored = localStorage.getItem(`fenix_mock_${key}`);
    if (stored) {
      return JSON.parse(stored, reviver) as T;
    }
  } catch (e) {
    console.error("Error loading localStorage", e);
  }
  // If not stored, init with default
  saveLocal(key, defaultData);
  return defaultData;
}

function saveLocal(key: string, data: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`fenix_mock_${key}`, JSON.stringify(data));
  }
}

// Global Clear for Logout — resets everything including seed version
export async function clearDemoData() {
  if (typeof window !== 'undefined') {
    ['companies', 'branches', 'appointments', 'services', 'employees', 'clients', 'transactions', 'products'].forEach(key => {
      localStorage.removeItem(`fenix_mock_${key}`);
    });
    localStorage.removeItem('fenix_seed_version');
  }
}

// ── GETTERS ──

export async function getCompanies() {
  await delay(100);
  return loadLocal('companies', mockCompanies);
}

export async function getBranches(companyId: string) {
  await delay(200);
  const data = loadLocal('branches', mockBranches);
  return data.filter((b: any) => b.companyId === companyId);
}

export async function getDashboardStats(companyId: string, branchId: string) {
  await delay(300);
  const todayStr = new Date().toDateString();
  
  const allApps = loadLocal('appointments', mockAppointments);
  const allSvcs = loadLocal('services', mockServices);
  const allEmps = loadLocal('employees', mockEmployees);
  const allClis = loadLocal('clients', mockClients);

  const branchAppointments = allApps.filter(
    (a: any) => a.companyId === companyId && a.branchId === branchId
  );
  
  const todayAppointments = branchAppointments.filter(
    (a: any) => new Date(a.date).toDateString() === todayStr
  );

  const todayRevenue = branchAppointments
    .filter((a: any) => a.status === "completada" && new Date(a.date).toDateString() === todayStr)
    .reduce((sum: number, a: any) => {
      const svc = allSvcs.find((s: any) => s.id === a.serviceId);
      return sum + (svc?.price ?? 0);
    }, 0);
    
  const branchEmployees = allEmps.filter(
    (e: any) => e.companyId === companyId && e.branchId === branchId
  );
  
  const recentRows = branchAppointments.slice(0, 10).map((a: any) => {
    const svc = allSvcs.find((s: any) => s.id === a.serviceId);
    const cli = allClis.find((c: any) => c.id === a.clientId);
    const emp = allEmps.find((e: any) => e.id === a.employeeId);
    return {
       client: cli?.name || `Cliente ${a.clientId}`,
       service: svc?.name ?? "N/A",
       time: new Date(a.date).toLocaleTimeString("es-ES", {
         hour: "2-digit",
         minute: "2-digit",
       }),
       status: a.status,
       employee: emp?.name || `Empleado ${a.employeeId}`,
       amount: `$${(svc?.price ?? 0).toLocaleString("es-CO")}`,
       rawAmount: svc?.price ?? 0,
    };
  });
  
  return {
    todayAppointments: todayAppointments.length,
    todayRevenue,
    activeEmployees: branchEmployees.length,
    recentAppointments: recentRows,
  };
}

export async function getAppointments(companyId: string, branchId: string) {
  await delay(300);
  const data = loadLocal('appointments', mockAppointments);
  return data.filter(
    (a: any) => a.companyId === companyId && a.branchId === branchId
  );
}

export async function getServices(companyId: string, branchId: string) {
  await delay(200);
  const data = loadLocal('services', mockServices);
  return data.filter(
    (s: any) => s.companyId === companyId && s.branchId === branchId
  );
}

export async function getEmployees(companyId: string, branchId: string) {
  await delay(200);
  const data = loadLocal('employees', mockEmployees);
  return data.filter(
    (e: any) => e.companyId === companyId && e.branchId === branchId
  );
}

export async function getClients(companyId: string, branchId: string) {
  await delay(200);
  const data = loadLocal('clients', mockClients);
  return data.filter(
    (c: any) => c.companyId === companyId && c.branchId === branchId
  );
}

export async function getTransactions(companyId: string, branchId: string) {
  await delay(300);
  const data = loadLocal('transactions', mockTransactions);
  return data.filter(
    (t: any) => t.companyId === companyId && t.branchId === branchId
  );
}


// ── CRUD MUTATIONS (Client side localStorage for Demo Purposes) ──

type MutateRes = { success: boolean, data?: any, error?: string };

function mutateItem(key: string, defaultData: any[], newItem: any): MutateRes {
  const data = loadLocal(key, defaultData);
  data.push(newItem);
  saveLocal(key, data);
  return { success: true, data: newItem };
}

function modifyItem(key: string, defaultData: any[], id: string, mutations: any): MutateRes {
  const data = loadLocal(key, defaultData);
  const idx = data.findIndex((x: any) => x.id === id);
  if (idx !== -1) {
    data[idx] = { ...data[idx], ...mutations };
    saveLocal(key, data);
    return { success: true, data: data[idx] };
  }
  return { success: false, error: "Item not found" };
}

function dropItem(key: string, defaultData: any[], id: string): MutateRes {
  const data = loadLocal(key, defaultData);
  const idx = data.findIndex((x: any) => x.id === id);
  if (idx !== -1) {
    data.splice(idx, 1);
    saveLocal(key, data);
    return { success: true };
  }
  return { success: false, error: "Item not found" };
}

export async function createEmployee(data: any): Promise<MutateRes> {
  await delay(300);
  const newEmp = { id: `emp-${Math.random().toString(36).substr(2, 6)}`, active: true, ...data };
  return mutateItem('employees', mockEmployees, newEmp);
}
export async function updateEmployee(id: string, data: any) {
  await delay(300);
  return modifyItem('employees', mockEmployees, id, data);
}
export async function deleteEmployee(id: string) {
  await delay(300);
  return dropItem('employees', mockEmployees, id);
}

export async function createAppointment(data: any): Promise<MutateRes> {
  await delay(300);
  const newApp = { id: `app-${Math.random().toString(36).substr(2, 6)}`, status: 'pendiente', ...data };
  return mutateItem('appointments', mockAppointments, newApp);
}
export async function updateAppointment(id: string, data: any) {
  await delay(300);
  return modifyItem('appointments', mockAppointments, id, data);
}
export async function deleteAppointment(id: string) {
  await delay(300);
  return dropItem('appointments', mockAppointments, id);
}

export async function createTransaction(data: any): Promise<MutateRes> {
  await delay(300);
  const newTx = { id: `tx-${Math.random().toString(36).substr(2, 6)}`, ...data };
  return mutateItem('transactions', mockTransactions, newTx);
}
export async function updateTransaction(id: string, data: any) {
  await delay(300);
  return modifyItem('transactions', mockTransactions, id, data);
}
export async function deleteTransaction(id: string) {
  await delay(300);
  return dropItem('transactions', mockTransactions, id);
}

export async function createBranch(data: any): Promise<MutateRes> {
  await delay(300);
  const newBranch = { id: `branch-${Math.random().toString(36).substr(2, 6)}`, ...data };
  return mutateItem('branches', mockBranches, newBranch);
}
export async function updateBranch(id: string, data: any) {
  await delay(300);
  return modifyItem('branches', mockBranches, id, data);
}
export async function deleteBranch(id: string) {
  await delay(300);
  return dropItem('branches', mockBranches, id);
}

export async function createService(data: any): Promise<MutateRes> {
  await delay(300);
  const newSvc = { id: `svc-${Math.random().toString(36).substr(2, 6)}`, ...data };
  return mutateItem('services', mockServices, newSvc);
}
export async function updateService(id: string, data: any) {
  await delay(300);
  return modifyItem('services', mockServices, id, data);
}
export async function deleteService(id: string) {
  await delay(300);
  return dropItem('services', mockServices, id);
}

export async function createClient(data: any): Promise<MutateRes> {
  await delay(300);
  const newCli = { id: `cli-${Math.random().toString(36).substr(2, 6)}`, points: 0, appointments: 0, ...data };
  return mutateItem('clients', mockClients, newCli);
}
export async function updateClient(id: string, data: any) {
  await delay(300);
  return modifyItem('clients', mockClients, id, data);
}
export async function deleteClient(id: string) {
  await delay(300);
  return dropItem('clients', mockClients, id);
}

// Special Checkout action for POS:
// 1. Mark Appointment as "completada" 
// 2. Add Transaction income
// 3. Award points to client (10% of total)
export async function checkoutAppointment(appointmentId: string, companyId: string, branchId: string, finalAmount: number, description: string, clientId: string) {
    await delay(500);
    
    // update appt
    modifyItem('appointments', mockAppointments, appointmentId, { status: "completada" });
    
    // Create trans
    createTransaction({
        companyId,
        branchId,
        date: new Date(),
        amount: finalAmount,
        type: 'ingreso',
        category: 'Servicios',
        description: description
    });
    
    // Add points to client
    const clientsData = loadLocal('clients', mockClients);
    const cliIdx = clientsData.findIndex((c: any) => c.id === clientId);
    if(cliIdx !== -1) {
        const earnedPoints = Math.floor(finalAmount * 0.10);
        clientsData[cliIdx].points = (clientsData[cliIdx].points || 0) + earnedPoints;
        clientsData[cliIdx].appointments = (clientsData[cliIdx].appointments || 0) + 1;
        saveLocal('clients', clientsData);
    }
    
    return { success: true };
}

// ── PRODUCTS ──
export async function getProducts(companyId: string, branchId?: string) {
  await delay(200);
  const data = loadLocal('products', mockProducts);
  return data.filter((p: any) => p.companyId === companyId && (!branchId || p.branchId === branchId));
}

export async function createProduct(data: any): Promise<MutateRes> {
  await delay(300);
  const newProd = { id: `prod-${Math.random().toString(36).substr(2, 6)}`, active: true, stock: 0, ...data };
  return mutateItem('products', mockProducts, newProd);
}
export async function updateProduct(id: string, data: any) {
  await delay(300);
  return modifyItem('products', mockProducts, id, data);
}
export async function deleteProduct(id: string) {
  await delay(300);
  return dropItem('products', mockProducts, id);
}
