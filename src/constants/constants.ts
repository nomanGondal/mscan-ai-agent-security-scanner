enum ROLE {
  USER = "user",
  ADMIN = "admin",
}

const MAX_AGE = 30 * 24 * 60 * 60

const ACCOUNT_TYPES = Object.freeze({
  FREE: "free",
  PRO: "pro",
  ENTERPRISE: "enterprise",
})

const QUERY_PARAMS = {
  USERNAME: "username",
  GUEST: "guest",
}

const SUBSCRIPTION_STATUS = Object.freeze({
  ACTIVE: "active",
  PAST_DUE: "past_due",
  CANCELLED: "cancelled",
  NONE: "none",
})

const USER_PERSONA = Object.freeze({
  AI_AGENT_DEVELOPER: "AI_AGENT_DEVELOPER",
  SECURITY_RESEARCHER: "SECURITY_RESEARCHER",
  PLATFORM_ENGINEER: "PLATFORM_ENGINEER",
  STARTUP_FOUNDER: "STARTUP_FOUNDER",
  ENTERPRISE_TEAM: "ENTERPRISE_TEAM",
  STUDENT: "STUDENT",
  OTHER: "OTHER",
} as const)

export {
  ROLE,
  USER_PERSONA,
  MAX_AGE,
  ACCOUNT_TYPES,
  SUBSCRIPTION_STATUS,
  QUERY_PARAMS,
}
