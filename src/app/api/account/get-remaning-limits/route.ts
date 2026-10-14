import { AccountModel } from "@/entities"
import { getCurrentUser } from "@/helpers"
import { NextResponse } from "next/server"

class SCANLIMIT {
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

  static MethodCheck(request: Request) {
    if (request.method !== "GET") {
      return SCANLIMIT.respond(false, "Method not allowed.", null, 405)
    }
  }

  async handle(request: Request) {
    try {
      const methodCheckResult = SCANLIMIT.MethodCheck(request)
      if (methodCheckResult) {
        return methodCheckResult
      }
      const user = await getCurrentUser()
      if (!user) {
        return SCANLIMIT.respond(false, "User not found.", null, 400)
      }
      const account = await AccountModel.findOne({
        user: user,
      })
      if (!account) {
        return SCANLIMIT.respond(false, "Acccount not found.", null, 400)
      }
      return SCANLIMIT.respond(
        true,
        "Account limit fetched.",
        account.reportsLimit,
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
      return SCANLIMIT.respond(false, errorMessage, null, 500)
    }
  }
}

async function GET(request: Request) {
  const newInstance = new SCANLIMIT()
  return await newInstance.handle(request)
}

export { GET }
