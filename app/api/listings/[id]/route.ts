import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      seller: {
        include: {
          received: { include: { reviewer: true }, orderBy: { createdAt: "desc" }, take: 5 },
        },
      },
    },
  });

  if (!listing) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  await prisma.listing.update({ where: { id }, data: { views: { increment: 1 } } });

  return NextResponse.json(listing);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const listing = await prisma.listing.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(listing);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.listing.update({ where: { id }, data: { status: "paused" } });
  return NextResponse.json({ ok: true });
}
