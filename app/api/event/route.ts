import { eventSchema } from "@/utils/validation";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse,NextRequest } from "next/server";

export async function POST(req: NextRequest){
    try{
        const body = await req.json();
        const parsedData = eventSchema.parse(body);
        const userId = await requireAuth();
        const user = await db.user.findUnique({ where: { clerkUserId: userId } });
        if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }
        if(!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }
        if(!parsedData) {
            return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
        }
        const {title ,description,price} = parsedData;
        const event = await db.event.create({
            data:{
                title,
                description,
                price,
                userId: user.id,
            }
        })
        return NextResponse.json({event}, { status: 201 });
    }catch (error) {
        console.error("Error creating event:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}