import { db } from '@/lib/db';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') as string) || 1;
    const limit = parseInt(searchParams.get('limit') as string) || 6;
    const skip = (page - 1) * limit;

    const events = await db.event.findMany({
      skip,
      take: limit,
    });

    const totalEvents = await db.event.count();

    return Response.json({
      events,
      totalPages: Math.ceil(totalEvents / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
