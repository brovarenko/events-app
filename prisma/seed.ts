// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  await db.registration.deleteMany();
  await db.event.deleteMany();

  console.log('Previous data deleted');

  const eventsData = Array.from({ length: 30 }, (_, i) => ({
    title: `Event ${i + 1}`,
    description: `Description for event ${i + 1}`,
    date: new Date(2024, 8, 1 + i),
    organizer: `Organizer ${i + 1}`,
  }));

  await db.event.createMany({
    data: eventsData,
  });

  const createdEvents = await db.event.findMany();

  for (const event of createdEvents) {
    const registrationsData = Array.from({ length: 6 }, (_, i) => ({
      fullName: `Participant ${i + 1} for Event ${event.id}`,
      email: `participant${i + 1}_event${event.id}@example.com`,
      dateOfBirth: new Date(1990, i, 15),
      eventId: event.id,
      referral: ['Social Media', 'Friend', 'Newsletter', 'Website'][i % 4],
    }));

    await db.registration.createMany({
      data: registrationsData,
    });
  }

  console.log('Seed complete');
}

main()
  .then(() => console.log('Seed complete'))
  .catch((e) => console.error(e))
  .finally(async () => await db.$disconnect());
