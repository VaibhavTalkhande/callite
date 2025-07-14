"use client";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Welcome {user?.fullName}</h1>
    </div>
  );
}
