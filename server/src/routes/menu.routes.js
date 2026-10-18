import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET all menu items
router.get('/', async (req, res, next) => {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: { id: 'asc' },
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

export default router;