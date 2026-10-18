import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET all orders
router.get('/', async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// GET a specific order by orderNumber
router.get('/:orderNumber', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber },
      include: { items: true },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// POST a new order
router.post('/', async (req, res, next) => {
  try {
    const { type, table, people, items, notes, discount } = req.body;

    const count = await prisma.order.count();
    const orderNumber = `F${String(count + 1).padStart(4, '0')}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        type: type || 'Dine In',
        table: table || null,
        people: Number(people) || 1,
        notes: notes || '',
        discount: Number(discount) || 0,
        status: 'New',
        items: {
          create: (items || []).map((item) => ({
            menuItemId: item.foodId,
            name: item.name,
            price: Number(item.price),
            qty: Number(item.qty),
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
});

// PATCH update order (discount, status, notes)
router.patch('/:orderNumber', async (req, res, next) => {
  try {
    const { discount, status, notes } = req.body;
    const updated = await prisma.order.update({
      where: { orderNumber: req.params.orderNumber },
      data: {
        ...(discount !== undefined && { discount: Number(discount) }),
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
      },
      include: { items: true },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// PATCH update order items
router.patch('/:orderNumber/items', async (req, res, next) => {
  try {
    const { items } = req.body;
    const orderNumber = req.params.orderNumber;

    await prisma.orderItem.deleteMany({
      where: { order: { orderNumber } },
    });

    const updated = await prisma.order.update({
      where: { orderNumber },
      data: {
        items: {
          create: (items || []).map((item) => ({
            menuItemId: item.foodId,
            name: item.name,
            price: Number(item.price),
            qty: Number(item.qty),
          })),
        },
      },
      include: { items: true },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;