"use client"

import { useAccountDetails, useImage } from "@/hooks"
import { UserAccountDetailsView } from "@/views"
import { useEffect } from "react"

const UserAccountDetails = () => {
  const {
    secureUrlForPreview,
    isGettingProfileImage,
    ImageFetchingError,
    getUserImage,
  } = useImage()

  const {
    isGettingAccountInformation,
    errorMessageForFetchingAccountInformation,
    accountDetailsForUser,
    getCurrentUserAccountDetails,
  } = useAccountDetails()

  useEffect(() => {
    getUserImage()
    getCurrentUserAccountDetails()
  }, [])

  return (
    <UserAccountDetailsView
      secureUrlForPreview={secureUrlForPreview}
      isGettingProfileImage={isGettingProfileImage}
      ImageFetchingError={ImageFetchingError}
      isGettingAccountInformation={isGettingAccountInformation}
      errorMessageForFetchingAccountInformation={
        errorMessageForFetchingAccountInformation
      }
      accountDetailsForUser={accountDetailsForUser}
    />
  )
}

export { UserAccountDetails }
