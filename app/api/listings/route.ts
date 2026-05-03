import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";

export async function GET(req: NextRequest) {
  await seedDatabase();

  const sp = req.nextUrl.searchParams;
  const q = sp.get("q") ?? "";
  const brand = sp.get("brand") ?? "";
  const state = sp.get("state") ?? "";
  const types = sp.getAll("type");
  const conditions = sp.getAll("condition");
  const warranties = sp.getAll("warranty");
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const limit = 12;

  const where: Record<string, unknown> = { status: "active" };

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { brand: { contains: q } },
      { partNumber: { contains: q } },
      { compatible: { contains: q } },
    ];
  }
  if (brand) where.brand = brand;
  if (state) where.state = state;
  if (types.length) where.type = { in: types };
  if (conditions.length) where.condition = { in: conditions };
  if (warranties.length) where.warranty = { in: warranties };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { seller: { select: { id: true, name: true, rating: true, totalSales: true, state: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.listing.count({ where }),
  ]);

  return NextResponse.json({ listings, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, brand, partNumber, type, condition, warranty, price, description, compatible, state, city, sellerId } = body;

  if (!title || !brand || !partNumber || !type || !condition || !warranty || !price || !state || !city || !sellerId) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: { title, brand, partNumber, type, condition, warranty, price: Number(price), description, compatible, state, city, sellerId },
    include: { seller: true },
  });

  return NextResponse.json(listing, { status: 201 });
}
