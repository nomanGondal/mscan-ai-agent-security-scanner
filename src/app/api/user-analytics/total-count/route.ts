import { UserModel } from "@/entities"
import { getCurrentUser } from "@/helpers"
import { NextResponse } from "next/server"

class GETUSERANALYTICS {
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
    if (request.method !== "GET") {
      return this.respond(false, "method not check.", null, 405)
    }
    return null
  }

  async handle(request: Request) {
    try {
      const methodCheckReasult = GETUSERANALYTICS.methodCheck(request)
      if (methodCheckReasult) {
        return methodCheckReasult
      }

      const user = await getCurrentUser()
      if (!user) {
        return GETUSERANALYTICS.respond(false, "user not found", null, 400)
      }
      const role = user?.role
      if (role !== "admin") {
        return GETUSERANALYTICS.respond(
          false,
          "you are not authorized.",
          null,
          400
        )
      }

      const countUsers = await UserModel.countDocuments({
        role: "user",
      })

      return GETUSERANALYTICS.respond(
        true,
        "user count fetched",
        countUsers,
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
      return GETUSERANALYTICS.respond(false, errorMessage, null, 500)
    }
  }
}

async function GET(request: Request) {
  const newInstance = new GETUSERANALYTICS()
  return await newInstance.handle(request)
}

export { GET }
