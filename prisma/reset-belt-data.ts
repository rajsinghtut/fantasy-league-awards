const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Run the following command to reset the belt data in the database:
// npx ts-node prisma/reset-belt-data.ts

async function main() {
  await prisma.beltHolder.deleteMany();
  await prisma.longestStreak.deleteMany();
  console.log('BeltHolder and LongestStreak data has been reset');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });