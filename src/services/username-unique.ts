import { API_ENDPOINTS } from "@/actions"
import { ApiResponse } from "@/types"
import axios, { AxiosError } from "axios"

interface USERNAMEUNIQUEPROPS {
  username: string
  signal?: AbortSignal
}

const checkUsernameUniquness = async ({
  username,
  signal,
}: USERNAMEUNIQUEPROPS): Promise<ApiResponse> => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.usernameuniqueness}?username=${username}`,
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
      message: "Network Error",
    }
  }
}

export { checkUsernameUniquness }
