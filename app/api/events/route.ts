import { db } from '@/lib/db';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') as string) || 10;
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderBy: any = {};

    if (sortBy && sortOrder) {
      orderBy[sortBy as string] = sortOrder as string;
    }

    const events = await db.event.findMany({
      orderBy,
      skip: parseInt(searchParams.get('offset') as string) || 0,
      take: limit,
    });

    return Response.json(events);
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
