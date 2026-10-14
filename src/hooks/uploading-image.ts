import { uploadImage } from "@/services"
import { AuthStatus } from "@/types"
import { useState } from "react"

const useUploadingImage = () => {
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [response, setResponse] = useState<AuthStatus>({
    error: "",
    success: "",
  })
  const [secureUrlForPreview, setSecureUrlForPreview] = useState<string>("")

  const setError = (message: string) => {
    setResponse({
      error: message,
      success: "",
    })
  }

  const setSuccess = (message: string) => {
    setResponse({
      error: "",
      success: message,
    })
  }

  const uploadingImage = async (file: File) => {
    setIsUploadingImage(true)
    setError("")
    setSuccess("")

    try {
      const result = await uploadImage(file)
      if (!result.success) {
        setError(result.message)
        return
      }
      if (result.data?.secure_url) {
        setSecureUrlForPreview(result.data.secure_url)
        setSuccess("Image uploaded successfully")
      }
    } finally {
      setIsUploadingImage(false)
    }
  }

  return {
    isUploadingImage,
    response,
    secureUrlForPreview,
    uploadingImage,
  }
}

export { useUploadingImage }
