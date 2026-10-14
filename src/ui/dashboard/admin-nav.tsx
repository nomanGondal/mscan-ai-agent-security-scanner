"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  LogOut,
} from "lucide-react";

const AdminNav = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Payments",
      href: "/admin/payments",
      icon: CreditCard,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-gray-800">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p className="text-xs text-gray-400 mt-1">Vulnerability Scanner</p>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.includes(item.href.split("/").pop() || "");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Icon size={20} />
              <span className="font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-800 space-y-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-900 hover:text-white transition font-semibold"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export { AdminNav };
