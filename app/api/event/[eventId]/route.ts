// app/api/event/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { eventSchema } from "@/utils/validation";



export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = await requireAuth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    const event = await prisma.event.findFirst({
      where: {
        id: params.id,
        userId: user?.id, // Ensure the event belongs to the authenticated user
      },
    });
  
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
  
    return NextResponse.json(event);
  }

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId  = await requireAuth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId
    }
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const event = await db.event.updateMany({
    where: {
      id: params.id,
        userId: user?.id,
    },
    data: parsed.data,
  });

  if (event.count === 0) {
    return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 404 });
  }

  return NextResponse.json({ message: "Event updated successfully" });
}
