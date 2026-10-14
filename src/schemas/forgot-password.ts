import { z } from "zod"

const previousPasswordGuard = z.string()
const newPasswordGuard = z.string()

const forgotPasswordSchema = z.object({
  previousPassword: previousPasswordGuard,
  newPassword: newPasswordGuard,
})

export { forgotPasswordSchema }
