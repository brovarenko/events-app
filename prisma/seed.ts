import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.event.createMany({
    data: [
      {
        title: 'Event 1',
        description: 'Description for event 1',
        date: new Date('2024-09-30'),
        organizer: 'Organizer 1',
      },
      {
        title: 'Event 2',
        description: 'Description for event 2',
        date: new Date('2024-10-05'),
        organizer: 'Organizer 2',
      },
    ],
  });
}

main()
  .then(() => console.log('Seed complete'))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
