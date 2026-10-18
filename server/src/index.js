import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import menuRoutes from './routes/menu.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import tablesRoutes from './routes/tables.routes.js';
import customersRoutes from './routes/customers.routes.js';
import staffRoutes from './routes/staff.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import reservationsRoutes from './routes/reservations.routes.js';
import paymentsRoutes from './routes/payments.routes.js';
import settingsRoutes from './routes/settings.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// --- Routes ---
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'TableMint API is running 🚀' });
});

app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/tables', tablesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/settings', settingsRoutes);

// --- Local development ---
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Local Server running on http://localhost:${PORT}\n`);
  });
}

export default app;