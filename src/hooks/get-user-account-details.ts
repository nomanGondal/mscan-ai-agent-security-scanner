import { getUserAccountDetails } from "@/services/get-account-details"
import { AccountDetailsApiResponse, AccountDetailsData } from "@/types"
import React, { useRef, useState } from "react"
import { useToggle } from "react-use"

const useAccountDetails = () => {
  const [isGettingAccountInformation, setIsGettingAccountInformation] =
    useToggle(false)
  const [
    errorMessageForFetchingAccountInformation,
    setErrorMessageForFetchingAccountInformation,
  ] = useState<string | null>("")
  const [accountDetailsForUser, setAccountDetailsForUser] =
    React.useState<AccountDetailsData | null>(null)

  const controllerForGettingCurrentUserAccountDetails =
    useRef<AbortController | null>(null)

  const getCurrentUserAccountDetails = async () => {
    setIsGettingAccountInformation(true)
    setErrorMessageForFetchingAccountInformation("")
    if (controllerForGettingCurrentUserAccountDetails.current) {
      controllerForGettingCurrentUserAccountDetails.current.abort()
    }
    const newController = new AbortController()
    controllerForGettingCurrentUserAccountDetails.current = newController
    try {
      const response = await getUserAccountDetails({
        signal: newController.signal,
      })
      if (!response.success) {
        setErrorMessageForFetchingAccountInformation(response.message)
      } else {
        setAccountDetailsForUser(response.data ?? null)
      }
    } finally {
      setIsGettingAccountInformation(false)
    }
  }

  return {
    isGettingAccountInformation,
    errorMessageForFetchingAccountInformation,
    accountDetailsForUser,
    getCurrentUserAccountDetails,
  }
}

export { useAccountDetails }
