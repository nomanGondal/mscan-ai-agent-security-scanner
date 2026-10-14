"use client";

import { useAdminGuard } from "@/hooks";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  useAdminGuard();
  return <>{children}</>;
}
