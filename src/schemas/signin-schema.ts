import { z } from "zod"

const identifierGuard = z.string()
const passwordGuard = z.string()

const signInSchema = z.object({
  identifier: identifierGuard,
  password: passwordGuard,
})

export { signInSchema }
