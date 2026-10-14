import { API_ENDPOINTS } from "@/actions"
import { ApiResponse } from "@/types"
import axios, { AxiosError } from "axios"

interface getTotalUsers {
  signal: AbortSignal
}

const getTotalCount = async ({
  signal,
}: getTotalUsers): Promise<ApiResponse> => {
  try {
    const response = await axios.get(API_ENDPOINTS.getAdminTotalUsersCount, {
      signal,
    })
    return response.data
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiResponse>
    if (axiosError.code === "ERR_CANCELLED") {
      return {
        success: false,
        message: "request cancelled",
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

export { getTotalCount }
