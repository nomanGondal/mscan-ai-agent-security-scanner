"use client"

import { useRouter } from "nextjs-toploader/app"

const useNavigation = () => {
  const router = useRouter()

  const navigateTo = (path: string) => {
    router.replace(path)
  }

  return { navigateTo }
}

export { useNavigation }
