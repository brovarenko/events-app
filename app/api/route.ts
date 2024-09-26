import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const skip = (page - 1) * limit;

  const events = await prisma.event.findMany({
    skip,
    take: limit,
  });

  const totalEvents = await prisma.event.count();

  res.status(200).json({
    events,
    totalPages: Math.ceil(totalEvents / limit),
    currentPage: page,
  });
}
