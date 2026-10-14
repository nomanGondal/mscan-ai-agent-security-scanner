"use client"

import { GETUSERACCOUNTDETAILSFIELDS } from "@/constants"
import { AccountDetailsData } from "@/types"
import { Box, Text } from "@radix-ui/themes"
import { Loader2 } from "lucide-react"

interface UserAccountDetailsProps {
  isGettingAccountInformation: boolean
  errorMessageForFetchingAccountInformation: string | null
  accountDetailsForUser: AccountDetailsData | null
}

const formatDate = (date: string | number | Date | null | undefined) => {
  if (!date) return "—"
  return new Date(date).toLocaleDateString()
}

const UserAccountDetailsBoard = ({
  isGettingAccountInformation,
  errorMessageForFetchingAccountInformation,
  accountDetailsForUser,
}: UserAccountDetailsProps) => {
  if (isGettingAccountInformation) {
    return (
      <Box className="w-full flex justify-center items-center py-20">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </Box>
    )
  }

  if (errorMessageForFetchingAccountInformation) {
    return (
      <Box className="w-full text-center py-10">
        <Text className="text-red-500">
          {errorMessageForFetchingAccountInformation}
        </Text>
      </Box>
    )
  }

  if (!accountDetailsForUser) {
    return (
      <Box className="w-full text-center py-10">
        <Text className="text-gray-500">No account details found</Text>
      </Box>
    )
  }

  return (
    <Box className="w-full mx-auto bg-white border rounded-xl p-6">
      <Text className="text-2xl font-semibold mb-6">Account Information</Text>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {GETUSERACCOUNTDETAILSFIELDS(formatDate, accountDetailsForUser).map(
          (item) => (
            <Box
              key={item.label}
              className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <Text className="text-base font-medium text-gray-800">
                {item.label}:
              </Text>
              <Text className="text-sm text-gray-500 ml-3">{item.value}</Text>
            </Box>
          )
        )}
      </Box>
    </Box>
  )
}

export { UserAccountDetailsBoard }
