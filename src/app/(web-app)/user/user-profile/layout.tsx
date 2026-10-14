"use client"

import React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import UserSidebar from "@/ui/user-profile/components/sidrbar"
import { Box } from "@radix-ui/themes"

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Box className="flex h-screen w-full">
        <Box className="shrink-0">
          <UserSidebar />
        </Box>
        <main className="flex-1 overflow-hidden">{children}</main>
      </Box>
    </SidebarProvider>
  )
}
