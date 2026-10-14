import { API_ENDPOINTS } from "@/actions"
import { ApiResponse } from "@/types"
import axios, { AxiosError } from "axios"

interface ForgotPasswordProps {
  signal: AbortSignal
  newPassword: string
  previousPassword: string
}

const Forgotpassword = async ({
  signal,
  previousPassword,
  newPassword,
}: ForgotPasswordProps): Promise<ApiResponse> => {
  try {
    const response = await axios.patch(API_ENDPOINTS.changeProfilePassword, {
      signal,
      previousPassword,
      newPassword,
    })
    return response.data
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiResponse>
    if (axiosError.code === "ERR_CANCELLED") {
      return {
        success: false,
        message: "Request cancelled",
      }
    }
    if (axiosError.response) {
      return axiosError.response.data
    }
    return {
      success: false,
      message: "Network Error",
    }
  }
}

export { Forgotpassword }
