import { Resend } from "resend"

let resend: Resend | null = null

const getResendClient = (): Resend => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error("Resend environment variable RESEND_API_KEY not found.")
    }
    resend = new Resend(apiKey)
  }
  return resend
}

export { getResendClient }
