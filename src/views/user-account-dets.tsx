"use clinet"

import { AccountDetailsApiResponse, AccountDetailsData } from "@/types"
import { AccountDetailsSectionOne, UserAccountDetailsBoard } from "@/ui"
import { Box } from "@radix-ui/themes"
import React from "react"

interface ACCOUNTDETSVIEWPROPS {
  secureUrlForPreview: string | null
  isGettingProfileImage: boolean
  ImageFetchingError: string | null
  isGettingAccountInformation: boolean
  errorMessageForFetchingAccountInformation: string | null
  accountDetailsForUser: AccountDetailsData | null
}

const UserAccountDetailsView = ({
  secureUrlForPreview,
  isGettingProfileImage,
  ImageFetchingError,
  isGettingAccountInformation,
  errorMessageForFetchingAccountInformation,
  accountDetailsForUser,
}: ACCOUNTDETSVIEWPROPS) => {
  return (
    <Box>
      <AccountDetailsSectionOne
        secureUrlForPreview={secureUrlForPreview}
        isGettingProfileImage={isGettingProfileImage}
        ImageFetchingError={ImageFetchingError}
      />
      <UserAccountDetailsBoard
        isGettingAccountInformation={isGettingAccountInformation}
        errorMessageForFetchingAccountInformation={
          errorMessageForFetchingAccountInformation
        }
        accountDetailsForUser={accountDetailsForUser}
      />
    </Box>
  )
}

export { UserAccountDetailsView }
