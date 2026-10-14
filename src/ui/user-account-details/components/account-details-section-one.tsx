"use client"

import { Label } from "@/components/ui/label"
import { Avatar, Box, Text } from "@radix-ui/themes"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"

interface AccountDetailsSectionOneProps {
  secureUrlForPreview: string | null
  isGettingProfileImage: boolean
  ImageFetchingError: string | null
}

const AccountDetailsSectionOne = ({
  secureUrlForPreview,
  isGettingProfileImage,
  ImageFetchingError,
}: AccountDetailsSectionOneProps) => {
  const { data: session } = useSession()
  const username = session?.user?.username

  return (
    <Box className="w-full flex justify-between items-center px-10 pt-10 border-b pb-2">
      <Box className="flex flex-col gap-4">
        <Label className="text-4xl">Account Details.</Label>
        <Label className="text-lg">
          Full Name:{" "}
          <Text className="text-black/60 font-normal">
            {session?.user?.fullName}
          </Text>
        </Label>
        <Label className="text-lg">
          Role:{" "}
          <Text className="text-black/60 font-normal">
            {session?.user?.role === "user" ? "USER" : ""}
          </Text>
        </Label>
      </Box>
      <Box className="relative w-52 h-52 rounded-full border-4 border-black overflow-hidden flex items-center justify-center shadow-lg">
        {isGettingProfileImage ? (
          <Loader2 className="animate-spin w-12 h-12" />
        ) : ImageFetchingError ? (
          <Box className="text-red-500 text-sm text-center px-2">
            {ImageFetchingError}
          </Box>
        ) : secureUrlForPreview ? (
          <Image
            src={secureUrlForPreview}
            alt="profile image"
            fill
            className="object-cover rounded-full"
            priority
          />
        ) : (
          <Avatar
            className="w-full h-full rounded-full bg-gray-200"
            fallback={username?.[0]?.toUpperCase() ?? "?"}
          />
        )}
      </Box>
    </Box>
  )
}

export { AccountDetailsSectionOne }
