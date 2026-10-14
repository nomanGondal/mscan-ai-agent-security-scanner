import { getTotalCount } from "@/services/get-total-count"
import { useRef, useState } from "react"
import { useToggle } from "react-use"

const useTotalCount = () => {
  const [totalCount, setTotalCount] = useState<number>(0)
  const [isGettingUserCount, setIsGettingUserCount] = useToggle(false)
  const controller = useRef<AbortController | null>(null)
  const getUsersCount = async () => {
    setIsGettingUserCount(true)
    if (controller.current) {
      controller.current.abort()
    }
    const newController = new AbortController()
    controller.current = newController

    try {
      const response = await getTotalCount({
        signal: newController.signal,
      })
      if (response.success && typeof response.data === "number") {
        setTotalCount(response.data)
      } else {
        setIsGettingUserCount(false)
        setIsGettingUserCount(0)
      }
    } finally {
      setIsGettingUserCount(false)
    }
  }

  return {
    isGettingUserCount,
    totalCount,
    getUsersCount,
  }
}

export { useTotalCount }
