import { API_ENDPOINTS } from "@/actions"
import { AccountDetailsApiResponse, ApiResponse } from "@/types"
import axios, { AxiosError } from "axios"

interface getCurrentAccountProps {
  signal: AbortSignal
}

const getUserAccountDetails = async ({
  signal,
}: getCurrentAccountProps): Promise<AccountDetailsApiResponse> => {
  try {
    const response = await axios.get(API_ENDPOINTS.getUserAccountInformation, {
      signal,
    })
    return response.data
  } catch (error: unknown) {
    const axiosError = error as AxiosError<AccountDetailsApiResponse>
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

export { getUserAccountDetails }
