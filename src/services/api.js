const BASE_URL = 'https://tablemint-eta.vercel.app/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('tablemint_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    window.dispatchEvent(new Event('tablemint:unauthorized'));
    throw new Error('Session expired. Please login again.');
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  updateProfile: (data) =>
    request('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Menu
  getMenu: () => request('/menu'),
  
  // Orders
  getOrders: () => request('/orders'),
  getOrderByNumber: (orderNumber) => request(`/orders/${orderNumber}`),
  createOrder: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrderStatus: (orderNumber, status) => request(`/orders/${orderNumber}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  updateOrderItems: (orderNumber, items) => request(`/orders/${orderNumber}/items`, { method: 'PATCH', body: JSON.stringify({ items }) }),
  updateOrder: (orderNumber, data) => request(`/orders/${orderNumber}`, { method: 'PATCH', body: JSON.stringify(data) }),
    
  // Tables
  getTables: () => request('/tables'),
  updateTable: (number, data) => request(`/tables/${number}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Customers
  getCustomers: () => request('/customers'),
  createCustomer: (data) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id, data) => request(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),

  // Staff
  getStaff: () => request('/staff'),
  createStaff: (data) => request('/staff', { method: 'POST', body: JSON.stringify(data) }),
  updateStaff: (id, data) => request(`/staff/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteStaff: (id) => request(`/staff/${id}`, { method: 'DELETE' }),

  // Inventory
  getInventory: () => request('/inventory'),
  getMovements: () => request('/inventory/movements'),
  createIngredient: (data) => request('/inventory', { method: 'POST', body: JSON.stringify(data) }),
  updateIngredient: (id, data) => request(`/inventory/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteIngredient: (id) => request(`/inventory/${id}`, { method: 'DELETE' }),
  addMovement: (id, data) => request(`/inventory/${id}/movements`, { method: 'POST', body: JSON.stringify(data) }),

  // Reservations
  getReservations: () => request('/reservations'),
  createReservation: (data) => request('/reservations', { method: 'POST', body: JSON.stringify(data) }),
  updateReservation: (id, data) => request(`/reservations/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteReservation: (id) => request(`/reservations/${id}`, { method: 'DELETE' }),

  // Payments
  getPayments: () => request('/payments'),
  createPayment: (data) => request('/payments', { method: 'POST', body: JSON.stringify(data) }),
  updatePayment: (id, data) => request(`/payments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PATCH', body: JSON.stringify(data) }),
};