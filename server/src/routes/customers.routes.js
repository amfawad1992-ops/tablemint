import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET all customers
router.get('/', async (req, res, next) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(customers);
  } catch (err) {
    next(err);
  }
});

// POST a new customer
router.post('/', async (req, res, next) => {
  try {
    const { name, phone, email, notes, loyaltyPoints } = req.body;
    const newCustomer = await prisma.customer.create({
      data: {
        name: name || 'Unnamed',
        phone: phone || null,
        email: email || null,
        notes: notes || null,
        loyaltyPoints: Number(loyaltyPoints) || 0,
      },
    });
    res.status(201).json(newCustomer);
  } catch (err) {
    next(err);
  }
});

// PATCH update a customer
router.patch('/:id', async (req, res, next) => {
  try {
    const { name, phone, email, notes, loyaltyPoints } = req.body;
    const updated = await prisma.customer.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(notes !== undefined && { notes }),
        ...(loyaltyPoints !== undefined && { loyaltyPoints: Number(loyaltyPoints) }),
      },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE a customer
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.customer.delete({
      where: { id: req.params.id },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;