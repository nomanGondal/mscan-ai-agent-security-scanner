import { API_ENDPOINTS } from "@/actions"
import { ApiResponse, IUserApiResponse, IUSERDETSRESPONSE } from "@/types"
import axios, { AxiosError } from "axios"

interface GetUserProps {
  signal: AbortSignal
}

const gettingUser = async ({
  signal,
}: GetUserProps): Promise<IUserApiResponse> => {
  try {
    const response = await axios.get<IUserApiResponse>(
      API_ENDPOINTS.gettingCurrentUserDets,
      { signal }
    )
    return response.data
  } catch (error: unknown) {
    const axiosError = error as AxiosError<IUserApiResponse>
    if (axiosError.code === "ERR_CANCELLED") {
      return {
        success: false,
        message: "Request Cancelled",
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

export { gettingUser }
