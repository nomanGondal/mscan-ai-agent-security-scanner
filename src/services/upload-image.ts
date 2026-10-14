import { API_ENDPOINTS } from "@/actions"
import { ImageUploadingResponse } from "@/types"
import axios, { AxiosError } from "axios"

const uploadImage = async (file: File): Promise<ImageUploadingResponse> => {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await axios.post<ImageUploadingResponse>(
      API_ENDPOINTS.imageUploadToServer,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    return response.data
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ImageUploadingResponse>

    if (axiosError.code === "ERR_CANCELLED") {
      return {
        success: false,
        message: "Request cancelled.",
      }
    }

    if (axiosError.response?.data) {
      return axiosError.response.data
    }

    return {
      success: false,
      message: "Network error",
    }
  }
}

export { uploadImage }
