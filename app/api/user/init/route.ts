import { requireAuth } from "@/lib/auth";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";


export async function POST() {
  const userId = await requireAuth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const existing = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (existing) return new Response("User already exists", { status: 200 });

  const client = await clerkClient();

  const clerkUser = await client.users?.getUser(userId);
  if (!clerkUser) return new Response("User not found", { status: 404 });

  const user = await db.user.create({
    data: {
      clerkUserId: userId,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: clerkUser.firstName || "",
      imageUrl: clerkUser.imageUrl,
    },
  });

  return Response.json({ user });
}
