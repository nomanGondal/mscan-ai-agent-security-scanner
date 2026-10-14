import { z } from "zod"

const verificationCodeGuard = z.string()

const verifyCodeSchema = z.object({
  verificationCode: verificationCodeGuard,
})

export { verifyCodeSchema }
