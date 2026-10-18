// Pehle ye tha:
// const BASE_URL = 'http://localhost:4000/api';

// Ab ye karo (aapka live backend URL):
const BASE_URL = 'https://tablemint-eta.vercel.app/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

export const api = {
  getMenu: () => request('/menu'),
  
  getOrders: () => request('/orders'),
  getOrderByNumber: (orderNumber) => request(`/orders/${orderNumber}`),
  createOrder: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrder: (orderNumber, data) => request(`/orders/${orderNumber}`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateOrderItems: (orderNumber, items) => request(`/orders/${orderNumber}/items`, { method: 'PATCH', body: JSON.stringify({ items }) }),
    
  getTables: () => request('/tables'),
  updateTable: (number, data) => request(`/tables/${number}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getCustomers: () => request('/customers'),
  createCustomer: (data) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id, data) => request(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),

  getStaff: () => request('/staff'),
  createStaff: (data) => request('/staff', { method: 'POST', body: JSON.stringify(data) }),
  updateStaff: (id, data) => request(`/staff/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteStaff: (id) => request(`/staff/${id}`, { method: 'DELETE' }),

  getInventory: () => request('/inventory'),
  getMovements: () => request('/inventory/movements'),
  createIngredient: (data) => request('/inventory', { method: 'POST', body: JSON.stringify(data) }),
  updateIngredient: (id, data) => request(`/inventory/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteIngredient: (id) => request(`/inventory/${id}`, { method: 'DELETE' }),
  addMovement: (id, data) => request(`/inventory/${id}/movements`, { method: 'POST', body: JSON.stringify(data) }),

  getReservations: () => request('/reservations'),
  createReservation: (data) => request('/reservations', { method: 'POST', body: JSON.stringify(data) }),
  updateReservation: (id, data) => request(`/reservations/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteReservation: (id) => request(`/reservations/${id}`, { method: 'DELETE' }),

  getPayments: () => request('/payments'),
  createPayment: (data) => request('/payments', { method: 'POST', body: JSON.stringify(data) }),
  updatePayment: (id, data) => request(`/payments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PATCH', body: JSON.stringify(data) }),
};