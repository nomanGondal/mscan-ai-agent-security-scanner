import { getCurrentUserProfileImage } from "@/services/get-profile-image"
import { useRef, useState } from "react"
import { useToggle } from "react-use"

const useImage = () => {
  const [secureUrlForPreview, setSecureUrlForPreview] = useState<string | null>(
    ""
  )
  const [isGettingProfileImage, setIsGettingProfileImage] = useToggle(false)
  const [ImageFetchingError, setImageFetchingError] = useState<string | null>(
    ""
  )

  const controllerForGettingImage = useRef<AbortController | null>(null)

  const getUserImage = async () => {
    setImageFetchingError("")
    setIsGettingProfileImage(true)
    if (controllerForGettingImage.current) {
      controllerForGettingImage.current.abort()
    }
    const newController = new AbortController()
    try {
      const response = await getCurrentUserProfileImage({
        signal: newController.signal,
      })
      if (!response.success) {
        setImageFetchingError(response.message)
      }
      if (response.success && typeof response.data === "string") {
        setSecureUrlForPreview(response.data)
        setImageFetchingError("")
      }
    } finally {
      setIsGettingProfileImage(false)
    }
  }

  return {
    secureUrlForPreview,
    isGettingProfileImage,
    ImageFetchingError,
    getUserImage,
  }
}

export { useImage }
