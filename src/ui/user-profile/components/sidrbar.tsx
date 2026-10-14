"use client"

import React, { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Box } from "@radix-ui/themes"
import { useSession, signOut } from "next-auth/react"
import { useNavigation } from "@/utiils"
import { AUTH } from "@/constants"
import { SIDEBARITEMS, PROFILE_SUBMENU } from "@/constants/user-sidebar"
import { LogOut, ChevronDown, ChevronUp } from "lucide-react"

const UserSidebar = () => {
  const { data: session } = useSession()
  const { navigateTo } = useNavigation()
  const [profileOpen, setProfileOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ redirect: false })
    navigateTo(AUTH)
  }

  return (
    <Sidebar collapsible="icon" className="bg-white! w-64 p-2">
      <Box className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white">
        <Box className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-white">
          {session?.user?.username?.[0].toUpperCase() || "U"}
        </Box>
        <span className="font-medium">{session?.user?.fullName || "User"}</span>
      </Box>
      <SidebarContent className="pt-4 bg-white">
        <SidebarGroup>
          <SidebarGroupLabel>User Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBARITEMS.map((item) => {
                if (item.label === "Profile") {
                  return (
                    <div key={item.label}>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center justify-between w-full border p-4 py-6 cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              {item.icon}
                              {item.label}
                            </span>
                            {profileOpen ? <ChevronUp /> : <ChevronDown />}
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      {profileOpen &&
                        PROFILE_SUBMENU.map((sub) => (
                          <SidebarMenuItem key={sub.label} className="pl-8">
                            <SidebarMenuButton asChild>
                              <a
                                href={sub.href}
                                className="flex items-center gap-2 mt-2"
                              >
                                {sub.icon}
                                {sub.label}
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                    </div>
                  )
                }
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.href}
                        className="flex items-center gap-2 p-4 py-6 cursor-pointer"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full text-left p-4 py-6 cursor-pointer"
                  >
                    <LogOut />
                    <span>Sign Out</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default UserSidebar
