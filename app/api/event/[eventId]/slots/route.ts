import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { addSlotSchema } from "@/utils/validation";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest,{params}:{params:{eventId:string}}) {
    const userId = await requireAuth();
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const body = await req.json();
    const parsedData = addSlotSchema.safeParse(body);
    if (!parsedData.success) {
        return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
    }
    const {dates} = parsedData.data;
    for(const EntryData of dates){
        const dateSlot = await db.dateSlot.create({
            data:{
                date: new Date(EntryData.date),
                eventId: params.eventId,
            }
        })
        for(const time of EntryData.timeSlots){
            const [year, month, day] = EntryData.date.split("-").map(Number);
            const [hours, minutes] = time.split(":").map(Number);
            const slotDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
            await db.timeSlot.create({
                data: {
                  time: slotDate,
                  dateSlotId: dateSlot.id,
                },
              });
        }
        return Response.json({ message: "Slots added successfully" });
    }
}