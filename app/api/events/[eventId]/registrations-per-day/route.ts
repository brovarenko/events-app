import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  console.log(params);
  const { eventId } = params;

  try {
    const registrationData = await db.registration.groupBy({
      by: ['createdAt'],
      where: {
        eventId: Number(eventId),
      },
      _count: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return Response.json(registrationData);
  } catch (error) {
    console.log(error);
    return Response.json({ error: 'Unable to fetch registration data' });
  }
}
