import { AUTH, UNAUTHORIZED, USER_DASHBOARD } from "@/constants"
import { useNavigation } from "@/utiils"
import { useSession } from "next-auth/react"
import { useEffect, useRef } from "react"

const useUserGuard = () => {
  const { data: session, status } = useSession()
  const { navigateTo } = useNavigation()
  const checked = useRef(false)

  useEffect(() => {
    if (status === "loading" || checked.current) return
    checked.current = true

    const path = window.location.pathname
    if (path === USER_DASHBOARD) return

    // if (!session || session.user.role !== "user") {
    //   navigateTo(UNAUTHORIZED)
    // }
  }, [status, session])
}

export { useUserGuard }
