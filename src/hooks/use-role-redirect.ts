import { ADMIN_DASHBOARD, USER_DASHBOARD, AUTH } from "@/constants"
import { useNavigation } from "@/utiils"
import { useSession } from "next-auth/react"
import { useEffect, useRef } from "react"

const useRoleRedirect = () => {
  const { data: session, status } = useSession()
  const { navigateTo } = useNavigation()
  const redirected = useRef(false)

  useEffect(() => {
    if (status === "loading" || redirected.current) return
    const path = window.location.pathname
    if (status !== "authenticated" || !session?.user?.role) {
      if (path !== AUTH) {
        redirected.current = true
        navigateTo(AUTH)
      }
      return
    }
    if (path === AUTH) {
      redirected.current = true
      if (session.user.role === "admin") navigateTo(ADMIN_DASHBOARD)
      else if (session.user.role === "user") navigateTo(USER_DASHBOARD)
    }
  }, [status, session])
}

export { useRoleRedirect }
