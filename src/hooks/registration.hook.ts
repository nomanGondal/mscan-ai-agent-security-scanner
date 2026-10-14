import { useToggle } from "react-use"
import React, { useRef, useState } from "react"
import { AuthStatus } from "@/types"

import * as z from "zod"
import { registrationSchema } from "@/schemas"
import { RegistrationService } from "@/services"

const useRegistration = () => {
  const [usernameForUserRegistration, setUsernameForUserRegistration] =
    React.useState<string>("")
  const [isRegistrationUnderProgress, setIsRegistrationUnderProgress] =
    useToggle(false)
  const [registrationProcessResponse, setRegistrationProcessResponse] =
    React.useState<AuthStatus>({
      error: "",
      success: "",
    })
  const controllerForRegistrationProcess = React.useRef<AbortController | null>(
    null
  )

  const setError = (message: string) => {
    setRegistrationProcessResponse((prev) => ({
      ...prev,
      error: message,
      success: "",
    }))
  }
  const setSuccess = (message: string) => {
    setRegistrationProcessResponse((prev) => ({
      ...prev,
      success: message,
      error: "",
    }))
  }
  const registerUser = async (data: z.infer<typeof registrationSchema>) => {
    setError("")
    setSuccess("")
    setIsRegistrationUnderProgress(true)
    if (controllerForRegistrationProcess.current) {
      controllerForRegistrationProcess.current.abort()
    }
    const newController = new AbortController()
    controllerForRegistrationProcess.current = newController
    const response = await RegistrationService({
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      persona: data.persona,
      signal: newController.signal,
    })
    if (response.success) {
      setSuccess(response.message || "Registration completed.")
    } else {
      setError(response.message || "Error while completing registration.")
    }
    setIsRegistrationUnderProgress(false)
  }

  return {
    usernameForUserRegistration,
    setUsernameForUserRegistration,
    isRegistrationUnderProgress,
    registrationProcessResponse,
    registerUser,
  }
}

export { useRegistration }
