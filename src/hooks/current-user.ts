import { gettingUser } from "@/services"
import { IUSERDETSRESPONSE, IUserApiResponse } from "@/types"
import { useRef, useState } from "react"
import { useToggle } from "react-use"

const useCurrentUser = () => {
  const [isGettingUserInformation, setIsGettingUserInformation] =
    useToggle(false)
  const [error, setError] = useState<string>("")
  const [userInformationData, setUserInformationData] =
    useState<IUSERDETSRESPONSE | null>(null)

  const controllerRef = useRef<AbortController | null>(null)

  const getUserInformation = async () => {
    setIsGettingUserInformation(true)
    setError("")

    if (controllerRef.current) controllerRef.current.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    const response: IUserApiResponse = await gettingUser({
      signal: controller.signal,
    })

    if (!response.success) {
      setError(response.message)
      setUserInformationData(null)
    } else {
      setUserInformationData(response.data!)
    }

    setIsGettingUserInformation(false)
  }

  return {
    isGettingUserInformation,
    error,
    userInformationData,
    getUserInformation,
  }
}

export { useCurrentUser }
