import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET all payments
router.get('/', async (req, res, next) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(payments);
  } catch (err) {
    next(err);
  }
});

// POST create a new payment
router.post('/', async (req, res, next) => {
  try {
    const { orderId, table, amount, method, status } = req.body;
    
    // Auto-generate receipt ID (e.g., PAY001)
    const count = await prisma.payment.count();
    const receiptId = `PAY${String(count + 1).padStart(3, '0')}`;

    const newPayment = await prisma.payment.create({
      data: {
        receiptId,
        orderId: orderId || null,
        table: table || null,
        amount: Number(amount) || 0,
        method: method || 'Cash',
        status: status || 'Paid',
      },
    });
    res.status(201).json(newPayment);
  } catch (err) {
    next(err);
  }
});

// PATCH update payment (mark as paid or refund)
router.patch('/:id', async (req, res, next) => {
  try {
    const { status, refundedAmount, method } = req.body;
    const updated = await prisma.payment.update({
      where: { id: req.params.id },
      data: {
        ...(status !== undefined && { status }),
        ...(method !== undefined && { method }),
        ...(refundedAmount !== undefined && { refundedAmount: Number(refundedAmount) }),
      },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;