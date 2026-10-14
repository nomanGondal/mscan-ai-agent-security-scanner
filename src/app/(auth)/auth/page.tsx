"use client"

import { useRoleRedirect } from "@/hooks/use-role-redirect"
import { Auth } from "@/ui/auth/auth"

const Page = () => {
  useRoleRedirect()

  return <Auth height="h-screen" width="w-[100vw]" />
}

export default Page
