import { API_ENDPOINTS } from "@/actions"
import { ApiResponse } from "@/types"
import axios, { AxiosError } from "axios"

interface RegistrationProps {
  signal?: AbortSignal
  username: string
  password: string
  email: string
  fullName: string
  persona: string
}

const RegistrationService = async ({
  signal,
  username,
  password,
  email,
  fullName,
  persona,
}: RegistrationProps): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.registration_endpoint,
      {
        username,
        password,
        email,
        fullName,
        persona,
      },
      { signal }
    )
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
      message: "Network error",
    }
  }
}

export { RegistrationService }
