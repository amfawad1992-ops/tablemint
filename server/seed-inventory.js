import { prisma } from './src/lib/prisma.js';

async function main() {
  console.log('🌱 Seeding Inventory...');

  const items = [
    { name: 'Chicken Breast', sku: 'MEAT-001', category: 'Meat', unit: 'kg', currentStock: 8, reorderLevel: 10, costPerUnit: 8.5, supplier: 'Fresh Farms' },
    { name: 'Beef Tenderloin', sku: 'MEAT-002', category: 'Meat', unit: 'kg', currentStock: 4.5, reorderLevel: 5, costPerUnit: 25, supplier: 'Fresh Farms' },
    { name: 'Salmon Fillet', sku: 'SEA-001', category: 'Seafood', unit: 'kg', currentStock: 12, reorderLevel: 8, costPerUnit: 22, supplier: 'Ocean Fresh' },
    { name: 'Shrimp (Large)', sku: 'SEA-002', category: 'Seafood', unit: 'kg', currentStock: 3.5, reorderLevel: 6, costPerUnit: 18, supplier: 'Ocean Fresh' },
    { name: 'Basmati Rice', sku: 'DRY-001', category: 'Dry Goods', unit: 'kg', currentStock: 45, reorderLevel: 20, costPerUnit: 2.2, supplier: 'Local Grains' },
    { name: 'Olive Oil', sku: 'DRY-002', category: 'Dry Goods', unit: 'L', currentStock: 6, reorderLevel: 3, costPerUnit: 12, supplier: 'Import Co' },
    { name: 'Tomatoes', sku: 'PROD-001', category: 'Produce', unit: 'kg', currentStock: 3, reorderLevel: 5, costPerUnit: 2, supplier: 'Fresh Farms' },
  ];

  for (const item of items) {
    await prisma.ingredient.create({ data: item });
  }

  console.log('✅ Inventory ready!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());