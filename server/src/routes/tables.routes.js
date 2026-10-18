import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET all tables
router.get('/', async (req, res, next) => {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { number: 'asc' },
    });
    res.json(tables);
  } catch (err) {
    next(err);
  }
});

// PATCH update table status
router.patch('/:number', async (req, res, next) => {
  try {
    const { status, currentOrderId, guestCount } = req.body;
    const updated = await prisma.table.update({
      where: { number: req.params.number },
      data: { 
        status,
        ...(currentOrderId !== undefined && { currentOrderId }),
        ...(guestCount !== undefined && { guestCount }),
      },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;