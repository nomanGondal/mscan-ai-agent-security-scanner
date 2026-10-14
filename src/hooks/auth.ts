import { signInSchema } from "@/schemas"
import { AuthStatus } from "@/types"
import { signIn, SignInResponse } from "next-auth/react"
import { useRef, useState } from "react"
import { useToggle } from "react-use"
import * as z from "zod"

const useAuth = () => {
  const [isSigningUser, setIsSigningUser] = useToggle(false)
  const [signingUserResponse, setSignInUserResponse] = useState<AuthStatus>({
    error: "",
    success: "",
  })

  const setError = (message: string) => {
    setSignInUserResponse((prev) => ({
      ...prev,
      error: message,
      success: "",
    }))
  }
  const setSuccess = (message: string) => {
    setSignInUserResponse((prev) => ({
      ...prev,
      error: "",
      success: message,
    }))
  }

  const signningInUser = async (data: z.infer<typeof signInSchema>) => {
    try {
      setIsSigningUser(true)
      setError("")
      setSuccess("")
      const response: SignInResponse | undefined = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      })
      if (!response?.ok) {
        setError(response?.error || "Error while procceeding auth.")
      } else {
        setSuccess("Auth procceed, welcome")
      }
    } catch (error: unknown) {
      let errorMessage = "unknown error"
      if (error instanceof Error) {
        errorMessage = error.message
      }
      if (typeof error === "string") {
        errorMessage = error
      }
      setError(errorMessage)
    } finally {
      setIsSigningUser(false)
    }
  }

  return {
    isSigningUser,
    signingUserResponse,
    signningInUser,
  }
}

export { useAuth }
