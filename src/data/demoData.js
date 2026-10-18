// STEP 10 — Demo data + shared helpers. Customers added, orders linked via customerId.

export const orderTabs = ['All', 'Dine in', 'Wait List', 'Take Away', 'Served'];
export const STATUS_FLOW = ['New', 'Confirmed', 'In Kitchen', 'Ready', 'Served', 'Completed'];
export const ORDER_TYPES = ['Dine In', 'Takeaway', 'Delivery'];

export const statusStyles = {
  New: 'bg-slate-100 text-slate-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  'Wait List': 'bg-orange-100 text-orange-700',
  'In Kitchen': 'bg-emerald-100 text-emerald-700',
  Ready: 'bg-violet-100 text-violet-700',
  Served: 'bg-teal-100 text-teal-700',
  Completed: 'bg-gray-100 text-gray-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export const TABLE_STATUSES = ['Available', 'Occupied', 'Reserved', 'Cleaning', 'Out of Service'];
export const TABLE_STATUS_STYLES = {
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Occupied: 'bg-orange-50 text-orange-700 border-orange-200',
  Reserved: 'bg-blue-50 text-blue-700 border-blue-200',
  Cleaning: 'bg-violet-50 text-violet-700 border-violet-200',
  'Out of Service': 'bg-gray-50 text-gray-500 border-gray-200',
};
export const TABLE_STATUS_PILL = {
  Available: 'bg-emerald-100 text-emerald-700',
  Occupied: 'bg-orange-100 text-orange-700',
  Reserved: 'bg-blue-100 text-blue-700',
  Cleaning: 'bg-violet-100 text-violet-700',
  'Out of Service': 'bg-gray-200 text-gray-600',
};
export const FLOORS = ['Main Floor', 'Terrace', 'Private Room'];

export const demoTables = [
  { id: '01', seats: 4, floor: 'Main Floor', status: 'Available', currentOrderId: null, guestCount: 0, note: '' },
  { id: '02', seats: 4, floor: 'Main Floor', status: 'Occupied', currentOrderId: 'F0032', guestCount: 4, note: '' },
  { id: '03', seats: 4, floor: 'Main Floor', status: 'Occupied', currentOrderId: 'F0027', guestCount: 2, note: '' },
  { id: '04', seats: 2, floor: 'Main Floor', status: 'Occupied', currentOrderId: 'F0030', guestCount: 2, note: '' },
  { id: '05', seats: 6, floor: 'Terrace', status: 'Available', currentOrderId: null, guestCount: 0, note: '' },
  { id: '06', seats: 4, floor: 'Terrace', status: 'Reserved', currentOrderId: null, guestCount: 0, note: 'Reserved for Mr. Khan · 8:00 PM' },
  { id: '07', seats: 2, floor: 'Terrace', status: 'Cleaning', currentOrderId: null, guestCount: 0, note: '' },
  { id: '08', seats: 8, floor: 'Private Room', status: 'Available', currentOrderId: null, guestCount: 0, note: '' },
  { id: '09', seats: 4, floor: 'Private Room', status: 'Out of Service', currentOrderId: null, guestCount: 0, note: 'Chair repair — back tomorrow' },
];

export function generateTableId(tables) {
  const nums = tables.map((t) => parseInt(t.id, 10)).filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return String(max + 1).padStart(2, '0');
}

export const DEFAULT_MENU_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&h=400&q=80';
export const defaultCategories = [
  { id: 'cat_special', name: 'Special' },
  { id: 'cat_soups', name: 'Soups' },
  { id: 'cat_desserts', name: 'Desserts' },
  { id: 'cat_chickens', name: 'Chickens' },
];
export const defaultMenuItems = [
  { id: 1, name: 'Grilled Salmon Steak', description: 'Pan-seared salmon with a lemon-butter sauce and seasonal greens.', price: 15.0, category: 'Special', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&h=400&q=80', prepTime: 15, available: true, featured: true },
  { id: 2, name: 'Tofu Poke Bowl', description: 'Crisp tofu, fresh vegetables, and sesame dressing over rice.', price: 7.0, category: 'Special', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&h=400&q=80', prepTime: 10, available: true, featured: false },
  { id: 3, name: 'Pasta with Roast Beef', description: 'Al dente pasta tossed with slow-roasted beef and herbs.', price: 10.0, category: 'Special', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=400&h=400&q=80', prepTime: 12, available: true, featured: false },
  { id: 4, name: 'Seafood Mix Wooden', description: 'Chef’s selection of fresh seafood served on a wooden platter.', price: 30.0, category: 'Special', image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=400&h=400&q=80', prepTime: 20, available: true, featured: true },
  { id: 5, name: 'Shrimp Rice Bowl', description: 'Garlic shrimp over steamed rice with a hint of chili.', price: 6.0, category: 'Soups', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&h=400&q=80', prepTime: 8, available: true, featured: false },
  { id: 6, name: 'Apple Stuffed Pancake', description: 'Fluffy pancakes filled with cinnamon apples and honey.', price: 35.0, category: 'Desserts', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=400&h=400&q=80', prepTime: 18, available: true, featured: false },
];

const minsAgo = (n) => new Date(Date.now() - n * 60 * 1000).toISOString();
export const demoOrders = [
  { id: 'F0027', type: 'Dine In', table: '03', people: 2, status: 'In Kitchen', createdAt: minsAgo(7), cardBg: 'mint', notes: 'No onions on the side.', customerId: 'C006', discount: 0, items: [{ foodId: 1, name: 'Grilled Salmon Steak', price: 15.0, qty: 1 }, { foodId: 5, name: 'Shrimp Rice Bowl', price: 6.0, qty: 1 }], statusHistory: [{ status: 'New', at: minsAgo(7) }, { status: 'Confirmed', at: minsAgo(6) }, { status: 'In Kitchen', at: minsAgo(5) }] },
  { id: 'F0028', type: 'Dine In', table: '03', people: 2, status: 'Confirmed', createdAt: minsAgo(4), cardBg: 'peach', notes: 'Extra spicy please.', customerId: 'C006', discount: 0, items: [{ foodId: 2, name: 'Tofu Poke Bowl', price: 7.0, qty: 2 }, { foodId: 3, name: 'Pasta with Roast Beef', price: 10.0, qty: 1 }], statusHistory: [{ status: 'New', at: minsAgo(4) }, { status: 'Confirmed', at: minsAgo(2) }] },
  { id: 'F0029', type: 'Takeaway', table: '—', people: 1, status: 'Ready', createdAt: minsAgo(18), cardBg: 'lavender', notes: 'Pack cutlery please.', customerId: 'C002', discount: 0, items: [{ foodId: 4, name: 'Seafood Mix Wooden', price: 30.0, qty: 1 }], statusHistory: [{ status: 'New', at: minsAgo(18) }, { status: 'Confirmed', at: minsAgo(16) }, { status: 'In Kitchen', at: minsAgo(12) }, { status: 'Ready', at: minsAgo(4) }] },
  { id: 'F0030', type: 'Dine In', table: '04', people: 2, status: 'In Kitchen', createdAt: minsAgo(16), cardBg: 'blue', notes: '', customerId: 'C004', discount: 0, items: [{ foodId: 3, name: 'Pasta with Roast Beef', price: 10.0, qty: 2 }, { foodId: 5, name: 'Shrimp Rice Bowl', price: 6.0, qty: 2 }, { foodId: 6, name: 'Apple Stuffed Pancake', price: 35.0, qty: 1 }], statusHistory: [{ status: 'New', at: minsAgo(16) }, { status: 'Confirmed', at: minsAgo(14) }, { status: 'In Kitchen', at: minsAgo(10) }] },
  { id: 'F0031', type: 'Takeaway', table: '—', people: 1, status: 'New', createdAt: minsAgo(1), cardBg: 'pink', notes: 'Rush order — customer waiting.', customerId: 'C006', discount: 0, items: [{ foodId: 1, name: 'Grilled Salmon Steak', price: 15.0, qty: 1 }, { foodId: 2, name: 'Tofu Poke Bowl', price: 7.0, qty: 1 }], statusHistory: [{ status: 'New', at: minsAgo(1) }] },
  { id: 'F0032', type: 'Dine In', table: '02', people: 4, status: 'Served', createdAt: minsAgo(45), cardBg: 'mint', notes: '', customerId: 'C001', discount: 0, items: [{ foodId: 4, name: 'Seafood Mix Wooden', price: 30.0, qty: 2 }, { foodId: 2, name: 'Tofu Poke Bowl', price: 7.0, qty: 2 }], statusHistory: [{ status: 'New', at: minsAgo(45) }, { status: 'Confirmed', at: minsAgo(43) }, { status: 'In Kitchen', at: minsAgo(35) }, { status: 'Ready', at: minsAgo(20) }, { status: 'Served', at: minsAgo(15) }] },
];

export const RESERVATION_STATUSES = ['Pending', 'Confirmed', 'Seated', 'Completed', 'Cancelled', 'No Show'];
export const RESERVATION_STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Seated: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-gray-100 text-gray-700',
  Cancelled: 'bg-red-100 text-red-700',
  'No Show': 'bg-rose-100 text-rose-700',
};
export const RESERVATION_TIME_SLOTS = ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
function daysFromNow(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
export const demoReservations = [
  { id: 'R001', name: 'Mr. Ahmed Khan', phone: '+92 300 1234567', date: daysFromNow(0), time: '20:00', guests: 4, tableId: '06', request: 'Window seat if possible', status: 'Confirmed', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'R002', name: 'Ms. Sana Iqbal', phone: '+92 321 7654321', date: daysFromNow(0), time: '19:30', guests: 2, tableId: null, request: 'Vegetarian options please', status: 'Pending', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
  { id: 'R003', name: 'Mr. Bilal Hassan', phone: '+92 333 9999999', date: daysFromNow(0), time: '13:00', guests: 6, tableId: '05', request: '', status: 'Seated', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 'R004', name: 'Mrs. Fatima Ali', phone: '+92 345 1112222', date: daysFromNow(1), time: '20:30', guests: 8, tableId: '08', request: 'Birthday celebration — cake will be brought', status: 'Confirmed', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'R005', name: 'Mr. Usman Raza', phone: '+92 300 5556666', date: daysFromNow(1), time: '19:00', guests: 2, tableId: null, request: '', status: 'Pending', createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
  { id: 'R006', name: 'Ms. Zara Nawaz', phone: '+92 311 4445555', date: daysFromNow(-1), time: '21:00', guests: 4, tableId: '02', request: '', status: 'Completed', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'R007', name: 'Mr. Hassan Tariq', phone: '+92 300 8887777', date: daysFromNow(-1), time: '20:00', guests: 3, tableId: null, request: '', status: 'No Show', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];
export function generateReservationId(reservations) {
  const nums = reservations.map((r) => parseInt(String(r.id).replace(/\D/g, ''), 10)).filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `R${String(max + 1).padStart(3, '0')}`;
}
export function hasReservationConflict(candidate, reservations, ignoreId = null) {
  if (!candidate.tableId || !candidate.date || !candidate.time) return null;
  const toMins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const candMins = toMins(candidate.time);
  return reservations.find((r) => {
    if (r.id === ignoreId) return false;
    if (r.status === 'Cancelled' || r.status === 'No Show') return false;
    if (r.tableId !== candidate.tableId) return false;
    if (r.date !== candidate.date) return false;
    return Math.abs(toMins(r.time) - candMins) < 90;
  }) ?? null;
}
export function formatDateLabel(iso) {
  const d = new Date(iso + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.getTime() === today.getTime()) return 'Today';
  if (d.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
}

export const PAYMENT_METHODS = ['Cash', 'Card', 'Scan'];
export const PAYMENT_STATUSES = ['Paid', 'Partially Paid', 'Refunded', 'Partially Refunded', 'Failed', 'Unpaid'];
export const PAYMENT_STATUS_STYLES = {
  Paid: 'bg-emerald-100 text-emerald-700',
  'Partially Paid': 'bg-amber-100 text-amber-700',
  Refunded: 'bg-violet-100 text-violet-700',
  'Partially Refunded': 'bg-violet-100 text-violet-700',
  Failed: 'bg-red-100 text-red-700',
  Unpaid: 'bg-slate-100 text-slate-700',
};
export const PAYMENT_METHOD_STYLES = {
  Cash: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Card: 'bg-blue-50 text-blue-700 border-blue-200',
  Scan: 'bg-violet-50 text-violet-700 border-violet-200',
};
const hoursAgo = (n) => new Date(Date.now() - n * 60 * 60 * 1000).toISOString();
const daysBack = (n) => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(12, 0, 0, 0); return d.toISOString(); };
export const demoPayments = [
  { id: 'PAY001', orderId: 'F0032', table: '02', amount: 76.74, method: 'Cash', status: 'Paid', createdAt: hoursAgo(0.25), items: [{ name: 'Seafood Mix Wooden', qty: 2, price: 30.0 }, { name: 'Tofu Poke Bowl', qty: 2, price: 7.0 }], subtotal: '74.00', tax: '0.74', donation: '2.00', total: '76.74', cashReceived: 80.0, changeDue: 3.26, refundedAmount: 0 },
  { id: 'PAY002', orderId: 'F0025', table: '06', amount: 52.52, method: 'Card', status: 'Paid', createdAt: hoursAgo(2), items: [{ name: 'Grilled Salmon Steak', qty: 2, price: 15.0 }, { name: 'Apple Stuffed Pancake', qty: 1, price: 35.0 }], subtotal: '65.00', tax: '0.65', donation: '2.00', total: '67.65', cashReceived: null, changeDue: 0, refundedAmount: 0 },
  { id: 'PAY003', orderId: 'F0024', table: '01', amount: 24.24, method: 'Scan', status: 'Paid', createdAt: hoursAgo(4), items: [{ name: 'Shrimp Rice Bowl', qty: 2, price: 6.0 }, { name: 'Tofu Poke Bowl', qty: 1, price: 7.0 }], subtotal: '19.00', tax: '0.19', donation: '2.00', total: '21.19', cashReceived: null, changeDue: 0, refundedAmount: 0 },
  { id: 'PAY004', orderId: 'F0023', table: '03', amount: 45.45, method: 'Card', status: 'Partially Refunded', createdAt: hoursAgo(6), items: [{ name: 'Pasta with Roast Beef', qty: 2, price: 10.0 }, { name: 'Seafood Mix Wooden', qty: 1, price: 30.0 }], subtotal: '50.00', tax: '0.50', donation: '2.00', total: '52.50', cashReceived: null, changeDue: 0, refundedAmount: 15.0 },
  { id: 'PAY005', orderId: 'F0022', table: '05', amount: 18.18, method: 'Cash', status: 'Paid', createdAt: daysBack(1), items: [{ name: 'Tofu Poke Bowl', qty: 1, price: 7.0 }, { name: 'Shrimp Rice Bowl', qty: 2, price: 6.0 }], subtotal: '19.00', tax: '0.19', donation: '2.00', total: '21.19', cashReceived: 25.0, changeDue: 3.81, refundedAmount: 0 },
  { id: 'PAY006', orderId: 'F0021', table: '—', amount: 9.09, method: 'Scan', status: 'Failed', createdAt: daysBack(1), items: [{ name: 'Shrimp Rice Bowl', qty: 1, price: 6.0 }], subtotal: '6.00', tax: '0.06', donation: '2.00', total: '8.06', cashReceived: null, changeDue: 0, refundedAmount: 0 },
  { id: 'PAY007', orderId: 'F0020', table: '04', amount: 0, method: 'Cash', status: 'Unpaid', createdAt: daysBack(2), items: [{ name: 'Grilled Salmon Steak', qty: 1, price: 15.0 }, { name: 'Apple Stuffed Pancake', qty: 1, price: 35.0 }], subtotal: '50.00', tax: '0.50', donation: '2.00', total: '52.50', cashReceived: null, changeDue: 0, refundedAmount: 0 },
  { id: 'PAY008', orderId: 'F0019', table: '02', amount: 88.88, method: 'Card', status: 'Refunded', createdAt: daysBack(3), items: [{ name: 'Seafood Mix Wooden', qty: 2, price: 30.0 }, { name: 'Grilled Salmon Steak', qty: 1, price: 15.0 }], subtotal: '75.00', tax: '0.75', donation: '2.00', total: '77.75', cashReceived: null, changeDue: 0, refundedAmount: 77.75 },
];
export function generatePaymentId(payments) {
  const nums = payments.map((p) => parseInt(String(p.id).replace(/\D/g, ''), 10)).filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `PAY${String(max + 1).padStart(3, '0')}`;
}

export const INVENTORY_CATEGORIES = ['Produce', 'Meat', 'Seafood', 'Dairy', 'Dry Goods', 'Spices', 'Beverages'];
export const INVENTORY_UNITS = ['kg', 'g', 'L', 'ml', 'pcs'];
export const MOVEMENT_TYPES = ['received', 'consumed', 'adjustment', 'waste'];
export const MOVEMENT_STYLES = {
  received: { label: 'Received', bg: 'bg-emerald-100', text: 'text-emerald-700', sign: '+' },
  consumed: { label: 'Consumed', bg: 'bg-blue-100', text: 'text-blue-700', sign: '−' },
  adjustment: { label: 'Adjustment', bg: 'bg-amber-100', text: 'text-amber-700', sign: '±' },
  waste: { label: 'Waste', bg: 'bg-red-100', text: 'text-red-700', sign: '−' },
};
export const STOCK_STATUS_STYLES = { ok: 'bg-emerald-100 text-emerald-700', low: 'bg-amber-100 text-amber-700', out: 'bg-red-100 text-red-700' };
export function getStockStatus(ingredient) {
  if (ingredient.currentStock <= 0) return 'out';
  if (ingredient.currentStock <= ingredient.reorderLevel) return 'low';
  return 'ok';
}
export const demoIngredients = [
  { id: 'ING001', name: 'Chicken Breast', sku: 'MEAT-001', category: 'Meat', unit: 'kg', currentStock: 8, reorderLevel: 10, costPerUnit: 8.5, supplier: 'Fresh Farms', note: '' },
  { id: 'ING002', name: 'Beef Tenderloin', sku: 'MEAT-002', category: 'Meat', unit: 'kg', currentStock: 4.5, reorderLevel: 5, costPerUnit: 25, supplier: 'Fresh Farms', note: '' },
  { id: 'ING003', name: 'Salmon Fillet', sku: 'SEA-001', category: 'Seafood', unit: 'kg', currentStock: 12, reorderLevel: 8, costPerUnit: 22, supplier: 'Ocean Fresh', note: 'Delivered fresh Mon & Thu' },
  { id: 'ING004', name: 'Shrimp (Large)', sku: 'SEA-002', category: 'Seafood', unit: 'kg', currentStock: 3.5, reorderLevel: 6, costPerUnit: 18, supplier: 'Ocean Fresh', note: '' },
  { id: 'ING005', name: 'Basmati Rice', sku: 'DRY-001', category: 'Dry Goods', unit: 'kg', currentStock: 45, reorderLevel: 20, costPerUnit: 2.2, supplier: 'Local Grains', note: '' },
  { id: 'ING006', name: 'Olive Oil', sku: 'DRY-002', category: 'Dry Goods', unit: 'L', currentStock: 6, reorderLevel: 3, costPerUnit: 12, supplier: 'Import Co', note: 'Extra virgin' },
  { id: 'ING007', name: 'Tomatoes', sku: 'PROD-001', category: 'Produce', unit: 'kg', currentStock: 3, reorderLevel: 5, costPerUnit: 2, supplier: 'Fresh Farms', note: 'Use within 2 days' },
  { id: 'ING008', name: 'Onions', sku: 'PROD-002', category: 'Produce', unit: 'kg', currentStock: 18, reorderLevel: 8, costPerUnit: 1.5, supplier: 'Fresh Farms', note: '' },
  { id: 'ING009', name: 'Butter', sku: 'DAI-001', category: 'Dairy', unit: 'kg', currentStock: 2, reorderLevel: 3, costPerUnit: 9, supplier: 'Dairy Best', note: '' },
  { id: 'ING010', name: 'Milk', sku: 'DAI-002', category: 'Dairy', unit: 'L', currentStock: 15, reorderLevel: 10, costPerUnit: 1.2, supplier: 'Dairy Best', note: '' },
  { id: 'ING011', name: 'Black Pepper', sku: 'SPC-001', category: 'Spices', unit: 'kg', currentStock: 0.5, reorderLevel: 1, costPerUnit: 45, supplier: 'Import Co', note: '' },
  { id: 'ING012', name: 'Flour', sku: 'DRY-003', category: 'Dry Goods', unit: 'kg', currentStock: 30, reorderLevel: 15, costPerUnit: 1.1, supplier: 'Local Grains', note: '' },
];
const hoursAgoInv = (n) => new Date(Date.now() - n * 60 * 60 * 1000).toISOString();
export const demoMovements = [
  { id: 'MV001', ingredientId: 'ING003', type: 'received', qty: 10, note: 'Morning delivery', user: 'Sohan', at: hoursAgoInv(6) },
  { id: 'MV002', ingredientId: 'ING003', type: 'consumed', qty: 4, note: 'Kitchen usage — dinner prep', user: 'Sohan', at: hoursAgoInv(2) },
  { id: 'MV003', ingredientId: 'ING001', type: 'received', qty: 5, note: 'Weekly delivery', user: 'Sohan', at: hoursAgoInv(24) },
  { id: 'MV004', ingredientId: 'ING001', type: 'consumed', qty: 3.5, note: 'Lunch rush', user: 'Sohan', at: hoursAgoInv(20) },
  { id: 'MV005', ingredientId: 'ING007', type: 'waste', qty: 1.5, note: 'Spoiled — end of day', user: 'Sohan', at: hoursAgoInv(10) },
  { id: 'MV006', ingredientId: 'ING004', type: 'consumed', qty: 2, note: 'Order F0027', user: 'Sohan', at: hoursAgoInv(4) },
  { id: 'MV007', ingredientId: 'ING009', type: 'received', qty: 3, note: 'Dairy delivery', user: 'Sohan', at: hoursAgoInv(30) },
  { id: 'MV008', ingredientId: 'ING009', type: 'adjustment', qty: -0.5, note: 'Count correction', user: 'Sohan', at: hoursAgoInv(8) },
  { id: 'MV009', ingredientId: 'ING011', type: 'consumed', qty: 0.3, note: 'Kitchen usage', user: 'Sohan', at: hoursAgoInv(12) },
  { id: 'MV010', ingredientId: 'ING005', type: 'received', qty: 25, note: 'Bulk delivery', user: 'Sohan', at: hoursAgoInv(48) },
];
export function generateIngredientId(ingredients) {
  const nums = ingredients.map((i) => parseInt(String(i.id).replace(/\D/g, ''), 10)).filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `ING${String(max + 1).padStart(3, '0')}`;
}
export function generateMovementId(movements) {
  const nums = movements.map((m) => parseInt(String(m.id).replace(/\D/g, ''), 10)).filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `MV${String(max + 1).padStart(3, '0')}`;
}

export const CUSTOMER_TIERS = ['New', 'Regular', 'VIP'];
export const CUSTOMER_TIER_STYLES = { New: 'bg-slate-100 text-slate-700', Regular: 'bg-brand-primary/10 text-brand-primary', VIP: 'bg-amber-100 text-amber-700' };
export function getCustomerTier(ordersCount, totalSpent) {
  if (ordersCount === 0) return 'New';
  if (ordersCount >= 3 || totalSpent >= 100) return 'VIP';
  return 'Regular';
}
export const demoCustomers = [
  { id: 'C001', name: 'Mr. Ahmed Khan', phone: '+92 300 1234567', email: 'ahmed.khan@example.com', notes: 'Prefers window seats. Regular weekend diner.', loyaltyPoints: 77, createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'C002', name: 'Ms. Sana Iqbal', phone: '+92 321 7654321', email: 'sana.iqbal@example.com', notes: 'Vegetarian preferences.', loyaltyPoints: 32, createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'C003', name: 'Mr. Bilal Hassan', phone: '+92 333 9999999', email: '', notes: 'First-time visitor, coming for lunch.', loyaltyPoints: 0, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'C004', name: 'Mrs. Fatima Ali', phone: '+92 345 1112222', email: 'fatima.ali@example.com', notes: 'Birthday celebration booking next week.', loyaltyPoints: 70, createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'C005', name: 'Mr. Usman Raza', phone: '+92 300 5556666', email: '', notes: '', loyaltyPoints: 0, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'C006', name: 'Ms. Zara Nawaz', phone: '+92 311 4445555', email: 'zara.nawaz@example.com', notes: 'Regular customer, loves seafood. Prefers table 03.', loyaltyPoints: 74, createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'C007', name: 'Mr. Hassan Tariq', phone: '+92 300 8887777', email: '', notes: 'No-showed once. Follow up before next booking.', loyaltyPoints: 0, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
];
export function generateCustomerId(customers) {
  const nums = customers.map((c) => parseInt(String(c.id).replace(/\D/g, ''), 10)).filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `C${String(max + 1).padStart(3, '0')}`;
}

export const STAFF_ROLES = ['Owner', 'Admin', 'Manager', 'Cashier', 'Waiter', 'Kitchen Staff'];
export const STAFF_ROLE_STYLES = {
  Owner: 'bg-purple-100 text-purple-700',
  Admin: 'bg-blue-100 text-blue-700',
  Manager: 'bg-indigo-100 text-indigo-700',
  Cashier: 'bg-emerald-100 text-emerald-700',
  Waiter: 'bg-teal-100 text-teal-700',
  'Kitchen Staff': 'bg-orange-100 text-orange-700',
};
export const STAFF_SHIFTS = ['Morning', 'Evening', 'Night', 'Off Today'];
export const STAFF_SHIFT_STYLES = {
  Morning: 'bg-amber-50 text-amber-700 border-amber-200',
  Evening: 'bg-violet-50 text-violet-700 border-violet-200',
  Night: 'bg-slate-100 text-slate-700 border-slate-200',
  'Off Today': 'bg-gray-50 text-gray-500 border-gray-200',
};
export const demoStaff = [
  { id: 'EMP001', name: 'Sohan Kumar', email: 'sohan@tablemint.local', phone: '+92 300 1111111', role: 'Owner', shift: 'Morning', active: true, joinedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'EMP002', name: 'Ayesha Malik', email: 'ayesha@tablemint.local', phone: '+92 300 2222222', role: 'Manager', shift: 'Evening', active: true, joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'EMP003', name: 'Ali Raza', email: 'ali@tablemint.local', phone: '+92 300 3333333', role: 'Cashier', shift: 'Morning', active: true, joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'EMP004', name: 'Hina Ahmed', email: 'hina@tablemint.local', phone: '+92 300 4444444', role: 'Waiter', shift: 'Evening', active: true, joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'EMP005', name: 'Bilal Sheikh', email: 'bilal@tablemint.local', phone: '+92 300 5555555', role: 'Kitchen Staff', shift: 'Night', active: true, joinedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'EMP006', name: 'Sara Khan', email: 'sara@tablemint.local', phone: '+92 300 6666666', role: 'Waiter', shift: 'Off Today', active: true, joinedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'EMP007', name: 'Zain Ali', email: 'zain@tablemint.local', phone: '+92 300 7777777', role: 'Cashier', shift: 'Evening', active: false, joinedAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'EMP008', name: 'Fatima Noor', email: 'fatima@tablemint.local', phone: '+92 300 8888888', role: 'Kitchen Staff', shift: 'Morning', active: true, joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
];
export function generateStaffId(staff) {
  const nums = staff.map((s) => parseInt(String(s.id).replace(/\D/g, ''), 10)).filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `EMP${String(max + 1).padStart(3, '0')}`;
}

export const defaultSettings = {
  restaurantName: 'TableMint',
  tagline: 'Smart Orders. Smooth Service. Better Business.',
  address: '123 Main Boulevard, Gulberg III',
  city: 'Lahore',
  phone: '+92 42 111 000 111',
  email: 'hello@tablemint.local',
  currency: 'PKR',
  timezone: 'Asia/Karachi (UTC+05:00)',
  taxRate: 1,
  donationAmount: 2.00,
  receiptFooter: 'Thank you for dining with us. Visit again soon!',
  openingHours: {
    Monday: { open: '11:00', close: '23:00', closed: false },
    Tuesday: { open: '11:00', close: '23:00', closed: false },
    Wednesday: { open: '11:00', close: '23:00', closed: false },
    Thursday: { open: '11:00', close: '23:00', closed: false },
    Friday: { open: '11:00', close: '23:00', closed: false },
    Saturday: { open: '11:00', close: '23:00', closed: false },
    Sunday: { open: '12:00', close: '22:00', closed: false },
  },
};

export function formatTimeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.round(diff / 60000));
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  const weeks = Math.round(days / 7);
  return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
}
export function formatElapsed(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const totalMins = Math.max(0, Math.floor(diff / 60000));
  if (totalMins < 60) return `${totalMins} min`;
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return `${hours}h ${mins}m`;
}
export function getPriority(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = diff / 60000;
  if (mins < 8) return 'fresh';
  if (mins < 15) return 'waiting';
  return 'overdue';
}
export const PRIORITY_STYLES = {
  fresh: { ring: 'ring-emerald-200', headerBg: 'bg-emerald-50', headerText: 'text-emerald-700', timeBg: 'bg-emerald-100 text-emerald-700' },
  waiting: { ring: 'ring-amber-200', headerBg: 'bg-amber-50', headerText: 'text-amber-700', timeBg: 'bg-amber-100 text-amber-700' },
  overdue: { ring: 'ring-red-300', headerBg: 'bg-red-50', headerText: 'text-red-700', timeBg: 'bg-red-100 text-red-700' },
};

// UPDATED computeTotals (Discount Support)
export function computeTotals(items, discount = 0) {
  const subtotalCents = items.reduce((sum, i) => sum + Math.round(i.price * 100) * i.qty, 0);
  const discountCents = Math.round(Number(discount) * 100);
  const taxableCents = Math.max(0, subtotalCents - discountCents);
  const taxCents = Math.round(taxableCents * 0.01);
  const donationCents = items.length > 0 ? 200 : 0;
  const totalCents = taxableCents + taxCents + donationCents;

  return {
    subtotal: (subtotalCents / 100).toFixed(2),
    discount: (discountCents / 100).toFixed(2),
    tax: (taxCents / 100).toFixed(2),
    donation: (donationCents / 100).toFixed(2),
    total: (totalCents / 100).toFixed(2),
  };
}

export function getNextStatus(current) {
  const i = STATUS_FLOW.indexOf(current);
  if (i === -1 || i >= STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[i + 1];
}
export function generateOrderId(orders) {
  const nums = orders.map((o) => parseInt(String(o.id).replace(/\D/g, ''), 10)).filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `F${String(max + 1).padStart(4, '0')}`;
}