import { z } from "zod"

const verificationCodeGuard = z.string()
const usernameGuard = z.string()

const verificationCodeSchema = z.object({
  username: usernameGuard,
  verificationCode: verificationCodeGuard,
})

export { verificationCodeSchema }
