import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Wipe existing data
  await prisma.orderHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.table.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.user.deleteMany();

  // 1. Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'Sohan',
      email: 'admin@tablemint.local',
      passwordHash,
      role: 'ADMIN',
    },
  });

  // 2. Settings
  await prisma.settings.create({
    data: { id: 'global', restaurantName: 'TableMint', currency: 'PKR' },
  });

  // 3. Categories
  const cats = ['Special', 'Soups', 'Desserts', 'Chickens'];
  for (const c of cats) {
    await prisma.category.create({ data: { name: c } });
  }

  // 4. Menu Items
  const menu = [
    { name: 'Grilled Salmon Steak', price: 15.0, category: 'Special', prepTime: 15, featured: true, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&h=400&q=80' },
    { name: 'Tofu Poke Bowl', price: 7.0, category: 'Special', prepTime: 10, featured: false, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&h=400&q=80' },
    { name: 'Pasta with Roast Beef', price: 10.0, category: 'Special', prepTime: 12, featured: false, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=400&h=400&q=80' },
    { name: 'Seafood Mix Wooden', price: 30.0, category: 'Special', prepTime: 20, featured: true, image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=400&h=400&q=80' },
    { name: 'Shrimp Rice Bowl', price: 6.0, category: 'Soups', prepTime: 8, featured: false, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&h=400&q=80' },
    { name: 'Apple Stuffed Pancake', price: 35.0, category: 'Desserts', prepTime: 18, featured: false, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=400&h=400&q=80' },
  ];
  for (const item of menu) {
    await prisma.menuItem.create({ data: item });
  }

  // 5. Tables
  const tables = ['01', '02', '03', '04', '05', '06'];
  for (const num of tables) {
    await prisma.table.create({ data: { number: num, seats: 4 } });
  }

  // 6. Customers
  await prisma.customer.create({
    data: { name: 'Mr. Ahmed Khan', phone: '+92 300 1234567', email: 'ahmed@example.com', loyaltyPoints: 50 },
  });

  // 7. Staff
  await prisma.staff.create({
    data: { name: 'Sohan', email: 'sohan@tablemint.local', role: 'Owner' },
  });

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });