"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  ACCOUNT_SETTINGS,
  ADMIN_DASHBOARD,
  ADMIN_MANAGE_USERS,
  ADMIN_PAYMENTS,
  ADMIN_USER_REPORTS,
  CHECKOUT,
  DOCS,
  DASHBOARD,
  HISTORY,
  PRICING,
  PAYMENTS,
  SCANNER,
  SCHEDULE_SCAN,
  SUBSCRIPTION,
  USER_ACCOUNT_DETAILS,
  USER_ACCOUNT_SETTINGS,
  USER_DASHBOARD,
  USER_MCP_SCANS,
  USER_PROFILE,
  USER_REPORTS,
  USER_SECURITY,
  USER_SETTINGS,
} from "@/constants";

const APP_ROUTE_PREFIXES = [
  DASHBOARD,
  HISTORY,
  PRICING,
  PAYMENTS,
  CHECKOUT,
  SCANNER,
  SCHEDULE_SCAN,
  DOCS,
  ACCOUNT_SETTINGS,
  SUBSCRIPTION,
  USER_DASHBOARD,
  USER_PROFILE,
  USER_ACCOUNT_SETTINGS,
  USER_ACCOUNT_DETAILS,
  USER_SECURITY,
  USER_REPORTS,
  USER_SETTINGS,
  USER_MCP_SCANS,
  ADMIN_DASHBOARD,
  ADMIN_MANAGE_USERS,
  ADMIN_PAYMENTS,
  ADMIN_USER_REPORTS,
];

const getShellType = (pathname: string) =>
  pathname.startsWith("/admin") ? "admin" : "user";

const WebAppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() || "";
  const useAppShell = APP_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!useAppShell) {
    return <>{children}</>;
  }

  const type = getShellType(pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar type={type} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader type={type} />
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default WebAppLayout;
