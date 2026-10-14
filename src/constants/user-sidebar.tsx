import { Calendar, FileText, Settings, Shield, User } from "lucide-react"
import { USER_ACCOUNT_DETAILS, USER_PROFILE, USER_SECURITY } from "./page-urls"

const SIDEBARITEMS = [
  {
    label: "Profile",
    href: "/user/profile",
    icon: <User />,
  },
  {
    label: "My Scans",
    href: "/user/scans",
    icon: <FileText />,
  },
  {
    label: "Reports",
    href: "/user/reports",
    icon: <Calendar />,
  },
  {
    label: "Settings",
    href: "/user/settings",
    icon: <Settings />,
  },
]

const PROFILE_SUBMENU = [
  {
    label: "Profle",
    href: USER_PROFILE,
    icon: <User />,
  },
  {
    label: "Account",
    href: USER_ACCOUNT_DETAILS,
    icon: <User />,
  },
  {
    label: "Security",
    href: USER_SECURITY,
    icon: <Shield />,
  },
]

export { SIDEBARITEMS, PROFILE_SUBMENU }
