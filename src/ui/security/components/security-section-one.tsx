"use client"

import { Label } from "@/components/ui/label"
import { Box, Text } from "@radix-ui/themes"
import { useSession } from "next-auth/react"

const SecuritySectionOne = () => {
  const { data: session } = useSession()
  const username = session?.user?.username
  const role = session?.user?.role
  const FullName = session?.user?.fullName
  return (
    <Box className="w-full px-10 pt-20 pb-2 border-b">
      <Label className="text-4xl">User Security</Label>
      <Box className="mt-5">
        <Label className="text-lg">
          Full Name:{" "}
          <Text className="text-black/60 font-normal">{FullName}</Text>
        </Label>
        <Label className="text-lg">
          Role:{" "}
          <Text className="text-black/60 font-normal">
            {role === "user" ? "USER" : ""}
          </Text>
        </Label>
        <Label className="text-lg">
          Username:{" "}
          <Text className="text-black/60 font-normal">{username}</Text>
        </Label>
      </Box>
    </Box>
  )
}

export { SecuritySectionOne }
