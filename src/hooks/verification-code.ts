import { verificationCodeSchema } from "@/schemas"
import { verifyCode } from "@/services"
import { AuthStatus } from "@/types"
import React, { useRef } from "react"
import { useToggle } from "react-use"
import * as z from "zod"

interface VERIFICATIONCODEPROPS {
  username: string
  verificationCode: string
}
const useVerificationCode = () => {
  const [verificationProcessResponse, setVerificationProcessResponse] =
    React.useState<AuthStatus>({
      success: "",
      error: "",
    })
  const [isVerifyingCode, setIsVerifyingCode] = useToggle(false)
  const controllerForVerificationCodeProcess = useRef<AbortController | null>(
    null
  )

  const setError = (message: string) => {
    setVerificationProcessResponse((prev) => ({
      ...prev,
      success: "",
      error: message,
    }))
  }
  const setSuccess = (message: string) => {
    setVerificationProcessResponse((prev) => ({
      ...prev,
      success: message,
      error: "",
    }))
  }

  const verificationCode = async ({
    username,
    verificationCode,
  }: VERIFICATIONCODEPROPS) => {
    setError("")
    setSuccess("")
    setIsVerifyingCode(true)

    if (controllerForVerificationCodeProcess.current) {
      controllerForVerificationCodeProcess.current.abort()
    }
    const newController = new AbortController()
    controllerForVerificationCodeProcess.current = newController
    const response = await verifyCode({
      username: username,
      signal: newController.signal,
      verificationCode: verificationCode,
    })
    if (response.success) {
      setSuccess(response.message)
    } else {
      setError(response.message)
    }

    setIsVerifyingCode(false)
  }
  return {
    verificationProcessResponse,
    isVerifyingCode,
    verificationCode,
  }
}

export { useVerificationCode }
