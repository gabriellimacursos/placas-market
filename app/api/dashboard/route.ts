import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";

export async function GET(req: NextRequest) {
  await seedDatabase();

  const sellerId = req.nextUrl.searchParams.get("sellerId");
  if (!sellerId) return NextResponse.json({ error: "sellerId obrigatório" }, { status: 400 });

  const [activeListings, orders, seller] = await Promise.all([
    prisma.listing.count({ where: { sellerId, status: "active" } }),
    prisma.order.findMany({
      where: { sellerId },
      include: { listing: true, buyer: { select: { name: true, state: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.user.findUnique({ where: { id: sellerId } }),
  ]);

  const revenue = orders
    .filter((o) => ["paid", "shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);

  const pending = orders.filter((o) => o.status === "paid").length;

  return NextResponse.json({ activeListings, orders, revenue, pending, seller });
}
