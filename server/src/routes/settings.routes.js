import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET settings (fetch the global settings)
router.get('/', async (req, res, next) => {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'global' },
    });

    // Agar database me pehle se nahi hai, to ek default bana do
    if (!settings) {
      settings = await prisma.settings.create({
        data: { id: 'global' },
      });
    }
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

// PATCH update settings
router.patch('/', async (req, res, next) => {
  try {
    const data = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete data.id;
    delete data.updatedAt;

    const updated = await prisma.settings.upsert({
      where: { id: 'global' },
      update: data,
      create: { id: 'global', ...data },
    });
    
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;