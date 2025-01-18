import bcrypt from 'bcrypt';
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const saltRounds = 10;

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@email.com',
      password: await bcrypt.hash('password123', saltRounds)
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'admin_2',
      email: 'admin.2@example.com',
      password: await bcrypt.hash('password123', saltRounds)
    },
  });

  // Create folders
  const rootFolder = await prisma.folder.create({
    data: {
      name: 'Root Folder',
      path: '/',
      userId: user1.id,
    },
  });

  const subFolder1 = await prisma.folder.create({
    data: {
      name: 'Subfolder 1',
      path: '/subfolder1',
      userId: user1.id,
      parentId: rootFolder.id,
    },
  });

  await prisma.folder.create({
    data: {
      name: 'Subfolder 2',
      path: '/subfolder2',
      userId: user2.id,
      parentId: rootFolder.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
