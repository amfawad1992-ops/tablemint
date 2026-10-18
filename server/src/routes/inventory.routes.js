import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET all ingredients
router.get('/', async (req, res, next) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(ingredients);
  } catch (err) {
    next(err);
  }
});

// GET all movements (for history)
router.get('/movements', async (req, res, next) => {
  try {
    const movements = await prisma.inventoryMovement.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(movements);
  } catch (err) {
    next(err);
  }
});

// POST a new ingredient
router.post('/', async (req, res, next) => {
  try {
    const { name, sku, category, unit, currentStock, reorderLevel, costPerUnit, supplier, note } = req.body;
    const newItem = await prisma.ingredient.create({
      data: {
        name,
        sku: sku || null,
        category,
        unit,
        currentStock: Number(currentStock) || 0,
        reorderLevel: Number(reorderLevel) || 0,
        costPerUnit: Number(costPerUnit) || 0,
        supplier: supplier || null,
        note: note || null,
      },
    });
    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
});

// PATCH update ingredient
router.patch('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, sku, category, unit, currentStock, reorderLevel, costPerUnit, supplier, note } = req.body;
    
    const updated = await prisma.ingredient.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(sku !== undefined && { sku }),
        ...(category !== undefined && { category }),
        ...(unit !== undefined && { unit }),
        ...(currentStock !== undefined && { currentStock: Number(currentStock) }),
        ...(reorderLevel !== undefined && { reorderLevel: Number(reorderLevel) }),
        ...(costPerUnit !== undefined && { costPerUnit: Number(costPerUnit) }),
        ...(supplier !== undefined && { supplier }),
        ...(note !== undefined && { note }),
      },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST record a movement (and update stock)
router.post('/:id/movements', async (req, res, next) => {
  try {
    const ingredientId = req.params.id;
    const { type, qty, note, user } = req.body;
    const q = Number(qty);

    // 1. Create movement record
    const movement = await prisma.inventoryMovement.create({
      data: {
        ingredientId,
        type,
        qty: q,
        note: note || null,
        user: user || 'Admin',
      },
    });

    // 2. Update ingredient stock
    const ingredient = await prisma.ingredient.findUnique({ where: { id: ingredientId } });
    let newStock = ingredient.currentStock;
    
    if (type === 'received') newStock += q;
    else if (type === 'consumed') newStock -= q;
    else if (type === 'waste') newStock -= q;
    else if (type === 'adjustment') newStock += q;
    
    if (newStock < 0) newStock = 0;

    const updatedIngredient = await prisma.ingredient.update({
      where: { id: ingredientId },
      data: { currentStock: newStock },
    });

    res.status(201).json({ movement, ingredient: updatedIngredient });
  } catch (err) {
    next(err);
  }
});

// DELETE ingredient
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.ingredient.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;