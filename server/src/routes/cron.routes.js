import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { seedDatabase } from '../lib/seedDb.js';

const router = Router();

// RESET DEMO DATABASE (Protected by secret)
router.get('/reset-db', async (req, res, next) => {
  try {
    // Check secret key to prevent unauthorized resets
    const authHeader = req.headers.authorization;
    const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

    if (!process.env.CRON_SECRET || authHeader !== expectedSecret) {
      return res.status(401).json({ error: 'Unauthorized. Invalid cron secret.' });
    }

    console.log('🔄 Cron trigger received. Resetting database...');
    await seedDatabase(prisma);
    res.json({ ok: true, message: 'Database reset successfully.' });
  } catch (err) {
    console.error('Cron reset failed:', err);
    next(err);
  }
});

export default router;