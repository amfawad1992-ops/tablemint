import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET all reservations
router.get('/', async (req, res, next) => {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { date: 'asc' },
    });
    res.json(reservations);
  } catch (err) {
    next(err);
  }
});

// POST a new reservation
router.post('/', async (req, res, next) => {
  try {
    const { name, phone, date, time, guests, tableId, request, status } = req.body;
    const newReservation = await prisma.reservation.create({
      data: {
        name,
        phone: phone || null,
        date,
        time,
        guests: Number(guests) || 1,
        tableId: tableId || null,
        request: request || null,
        status: status || 'Pending',
      },
    });
    res.status(201).json(newReservation);
  } catch (err) {
    next(err);
  }
});

// PATCH update a reservation (status, table, etc.)
router.patch('/:id', async (req, res, next) => {
  try {
    const { status, tableId, request, name, phone, date, time, guests } = req.body;
    const updated = await prisma.reservation.update({
      where: { id: req.params.id },
      data: {
        ...(status !== undefined && { status }),
        ...(tableId !== undefined && { tableId }),
        ...(request !== undefined && { request }),
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(date !== undefined && { date }),
        ...(time !== undefined && { time }),
        ...(guests !== undefined && { guests: Number(guests) }),
      },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE a reservation
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.reservation.delete({
      where: { id: req.params.id },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;