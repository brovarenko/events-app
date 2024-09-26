import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const eventId = params.eventId;

  try {
    const event = await db.event.findUnique({
      where: {
        id: Number(eventId),
      },
      include: {
        registrations: true,
      },
    });

    if (!event) {
      return Response.json({ error: 'Event not found' });
    }

    return Response.json({
      eventName: event.title,
      participants: event.registrations.map((p) => ({
        fullName: p.fullName,
        email: p.email,
      })),
    });
  } catch (error) {
    console.log(error);
    Response.json({ error: 'Failed to load participants' });
  }
}
