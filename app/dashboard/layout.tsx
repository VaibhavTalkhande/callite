"use client";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    const syncUser = async () => {
      const token = await getToken();
      await fetch("/api/user/init", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    };
    syncUser();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
} 