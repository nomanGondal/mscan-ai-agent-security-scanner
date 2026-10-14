import React from "react"
import { forgotPasswordSchema } from "@/schemas"
import { Forgotpassword } from "@/services"
import { AuthStatus } from "@/types"
import { useToggle } from "react-use"
import * as z from "zod"

const usePasswordUpdation = () => {
  const [UpdatingPasswordResponse, setUpdatingPasswordResponse] =
    React.useState<AuthStatus>({
      success: "",
      error: "",
    })

  const [isUpdatingPassword, setIsUpdatingPassword] = useToggle(false)

  const controllerForUpdatingPassword = React.useRef<AbortController | null>(
    null
  )

  const setError = (message: string) => {
    setUpdatingPasswordResponse((prev) => ({
      ...prev,
      success: "",
      error: message,
    }))
  }

  const setSuccess = (message: string) => {
    setUpdatingPasswordResponse((prev) => ({
      ...prev,
      success: message,
      error: "",
    }))
  }

  const updatePassword = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setError("")
    setSuccess("")
    setIsUpdatingPassword(true)
    if (controllerForUpdatingPassword.current) {
      controllerForUpdatingPassword.current.abort()
    }
    const newController = new AbortController()
    controllerForUpdatingPassword.current = newController

    try {
      const response = await Forgotpassword({
        signal: newController.signal,
        previousPassword: data.previousPassword,
        newPassword: data.newPassword,
      })
      if (!response.success) {
        setError(response.message)
      } else {
        setSuccess(response.message)
      }
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return {
    UpdatingPasswordResponse,
    isUpdatingPassword,
    updatePassword,
  }
}

export { usePasswordUpdation }
