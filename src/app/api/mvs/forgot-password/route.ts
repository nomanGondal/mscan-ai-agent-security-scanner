import { getCurrentUser } from "@/helpers"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { connect_db } from "@/settings"

class FORGOTPASSWORD {
  static respond(
    success: boolean,
    message: string,
    data: unknown = null,
    status: number = 200
  ) {
    return NextResponse.json(
      {
        success,
        message,
        data,
      },
      {
        status,
      }
    )
  }

  static methodCheck(request: Request) {
    if (request.method !== "PATCH") {
      return this.respond(false, "method not allowed", 405)
    }
  }

  async handle(request: Request) {
    try {
      const methodCheckResult = FORGOTPASSWORD.methodCheck(request)
      if (methodCheckResult) {
        return methodCheckResult
      }
      await connect_db()
      const user = await getCurrentUser()
      if (!user) {
        return FORGOTPASSWORD.respond(false, "User not found", null, 400)
      }
      const { previousPassword, newPassword } = await request.json()
      if (!previousPassword || !newPassword) {
        return FORGOTPASSWORD.respond(
          false,
          "Please provide some values",
          null,
          400
        )
      }
      if (
        typeof newPassword !== "string" ||
        typeof previousPassword !== "string"
      ) {
        return FORGOTPASSWORD.respond(
          false,
          "Please validate password.",
          null,
          400
        )
      }
      console.log("the new password is:", newPassword)
      console.log("the previous password is:", previousPassword)

      const isPasswordMatched = await bcrypt.compare(
        previousPassword,
        user.password
      )
      if (!isPasswordMatched) {
        return FORGOTPASSWORD.respond(
          false,
          "Please enter correct previous password.",
          null,
          400
        )
      }
      const isSamePassword = await bcrypt.compare(newPassword, user.password)
      if (isSamePassword) {
        return FORGOTPASSWORD.respond(
          false,
          "New password must be different from old password",
          null,
          400
        )
      }
      const newHashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = newHashedPassword
      await user.save()

      return FORGOTPASSWORD.respond(
        true,
        "Password updated successfully",
        null,
        200
      )
    } catch (error: unknown) {
      let errorMessage = "unknown error"
      if (error instanceof Error) {
        errorMessage = error?.message
      }
      if (typeof error === "string") {
        errorMessage = error
      }

      return FORGOTPASSWORD.respond(false, errorMessage, null, 500)
    }
  }
}

async function PATCH(request: Request) {
  const newInstance = new FORGOTPASSWORD()
  return await newInstance.handle(request)
}

export { PATCH }
