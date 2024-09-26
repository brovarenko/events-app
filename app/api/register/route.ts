import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { fullName, email, dateOfBirth, referral, eventId } =
      await req.json();

    const registration = await db.registration.create({
      data: {
        fullName,
        email,
        dateOfBirth: new Date(dateOfBirth),
        referral,
        event: { connect: { id: parseInt(eventId) } },
      },
    });

    return NextResponse.json(registration);
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
