import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET all staff
router.get('/', async (req, res, next) => {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(staff);
  } catch (err) {
    next(err);
  }
});

// POST a new staff member
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, role, shift, active } = req.body;
    const newStaff = await prisma.staff.create({
      data: {
        name: name || 'Unnamed',
        email: email || '',
        phone: phone || null,
        role: role || 'Waiter',
        shift: shift || 'Morning',
        active: active !== false,
      },
    });
    res.status(201).json(newStaff);
  } catch (err) {
    next(err);
  }
});

// PATCH update a staff member
router.patch('/:id', async (req, res, next) => {
  try {
    const { name, email, phone, role, shift, active } = req.body;
    const updated = await prisma.staff.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(role !== undefined && { role }),
        ...(shift !== undefined && { shift }),
        ...(active !== undefined && { active }),
      },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE a staff member
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.staff.delete({
      where: { id: req.params.id },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;