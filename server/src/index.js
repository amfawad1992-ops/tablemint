import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import { requireAuth } from './middleware/auth.middleware.js';
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

// Public Routes
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'TableMint API is running 🚀' });
});
app.use('/api/auth', authRoutes);

// Protected Routes (Token zaroori hai)
app.use('/api/menu', requireAuth, menuRoutes);
app.use('/api/orders', requireAuth, ordersRoutes);
app.use('/api/tables', requireAuth, tablesRoutes);
app.use('/api/customers', requireAuth, customersRoutes);
app.use('/api/staff', requireAuth, staffRoutes);
app.use('/api/inventory', requireAuth, inventoryRoutes);
app.use('/api/reservations', requireAuth, reservationsRoutes);
app.use('/api/payments', requireAuth, paymentsRoutes);
app.use('/api/settings', requireAuth, settingsRoutes);

// --- Local development ---
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Local Server running on http://localhost:${PORT}\n`);
  });
}

export default app;