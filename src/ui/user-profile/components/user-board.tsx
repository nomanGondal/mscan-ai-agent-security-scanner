"use client"

import { useCurrentUser, useUploadingImage } from "@/hooks"
import { Avatar, Box } from "@radix-ui/themes"
import { useRef, useEffect } from "react"
import Image from "next/image"
import { Pencil, Loader2 } from "lucide-react"
import { showToast } from "@/utiils"
import { SkeletonUserDetails } from "./skeleton"
import { NoDataUser } from "@/components"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GETUSERFIELDS } from "@/constants"

const UserBoard = () => {
  const {
    isGettingUserInformation,
    error,
    userInformationData,
    getUserInformation,
  } = useCurrentUser()

  const { isUploadingImage, response, secureUrlForPreview, uploadingImage } =
    useUploadingImage()

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getUserInformation()
  }, [])

  useEffect(() => {
    if (error) showToast(error, "error")
  }, [error])

  useEffect(() => {
    if (response.error) showToast(response.error, "error")
    if (response.success) showToast(response.success, "success")
  }, [response])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploadingImage(file)
  }

  if (isGettingUserInformation) return <SkeletonUserDetails />
  if (!userInformationData) return <NoDataUser />

  const user = userInformationData

  return (
    <Box className="w-full mx-auto bg-white shadow-md overflow-hidden h-[90vh] relative">
      <Box className="h-32 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 relative">
        <Box className="absolute -bottom-16 left-8 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gray-100">
          {secureUrlForPreview || user.profilePicture?.url ? (
            <Image
              src={secureUrlForPreview || user.profilePicture!.url}
              alt="profile"
              fill
              className="object-cover"
            />
          ) : (
            <Avatar
              fallback={user.fullName?.[0]?.toUpperCase() ?? "A"}
              className="h-full w-full flex items-center justify-center text-4xl text-gray-700 bg-gray-200"
            />
          )}
        </Box>
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploadingImage}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
        >
          {isUploadingImage ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Pencil className="h-5 w-5 text-gray-700" />
          )}
        </Button>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </Box>

      <Box className="pt-20 px-8 pb-8 space-y-6 overflow-y-auto h-[calc(80vh-8rem)]">
        <h2 className="text-2xl font-semibold">{user.fullName}</h2>
        <p className="text-gray-500">@{user.username}</p>
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GETUSERFIELDS(user).map((field) => (
            <Box
              key={field.label}
              className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <p className="text-gray-500 text-sm">{field.label}</p>
              <p className="font-medium text-gray-800">{field.value}</p>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default UserBoard
