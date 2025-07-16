"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Events", href: "/dashboard/events" },
  { name: "Availability", href: "/dashboard/availability" },
  { name: "Create Event", href: "/dashboard/create-event" },
  { name: "Booking", href: "/dashboard/booking" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <nav className="h-full w-56 bg-gray-100 p-6 flex flex-col gap-2 border-r">
      <h2 className="text-lg font-bold mb-6">Dashboard</h2>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-3 py-2 rounded transition-colors font-medium ${
            pathname === item.href
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-100"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
} 