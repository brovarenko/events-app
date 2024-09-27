import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const searchParams = req.nextUrl.searchParams;
  const eventId = params.eventId;
  const searchQuery = searchParams.get('searchQuery');

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

    const filteredParticipants = event.registrations.filter(
      (participant) =>
        participant.fullName
          .toLowerCase()
          .includes((searchQuery || '').toString().toLowerCase()) ||
        participant.email
          .toLowerCase()
          .includes((searchQuery || '').toString().toLowerCase())
    );

    return Response.json({
      eventName: event.title,
      participants: filteredParticipants.map((p) => ({
        fullName: p.fullName,
        email: p.email,
      })),
    });
  } catch (error) {
    console.log(error);
    Response.json({ error: 'Failed to load participants' });
  }
}
