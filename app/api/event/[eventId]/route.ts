"use server";
import { NextRequest, NextResponse } from "next/server";
import { db} from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { eventSchema } from "@/utils/validation";



export async function GET(req: NextRequest, {params}: { params: { eventId: string } }) {
    const userId = await requireAuth();
    const { eventId } = await params;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });

    const event = await db.event.findFirst({
        where: {
            id: eventId,
            userId: user?.id,
        },
        include: {
            dateSlot: {
                include: {
                    timeSlot: true,
                },
            },
        },
    });

    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    return NextResponse.json(event);
}

export async function PUT(req: NextRequest, { params }: { params: { eventId: string } }) {
    try {
        const { eventId } = await params;
        if (!eventId) {
            return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
        }

        const userId = await requireAuth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const parsed = eventSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const event = await db.event.update({
            where: {
                id: eventId,
                userId: user.id,
            },
            data: parsed.data,
        });

        return NextResponse.json({ message: "Event updated successfully", event });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error or unauthorized" }, { status: 500 });
    }
}
