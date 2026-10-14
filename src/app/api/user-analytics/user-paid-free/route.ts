import { AccountModel } from "@/entities"
import { getCurrentUser } from "@/helpers"
import { NextResponse } from "next/server"
import { ACCOUNT_TYPES } from "@/constants"

class GETPIEDATA {
  static respond(
    success: boolean,
    message: string,
    data: unknown = null,
    status: number = 200
  ) {
    return NextResponse.json({ success, message, data }, { status })
  }

  static methodCheck(request: Request) {
    if (request.method !== "GET") {
      return this.respond(false, "Method not allowed", null, 405)
    }
  }

  async handle(request: Request) {
    try {
      const methodCheckResult = GETPIEDATA.methodCheck(request)
      if (methodCheckResult) return methodCheckResult

      const user = await getCurrentUser()
      if (!user) {
        return GETPIEDATA.respond(false, "User not found", null, 401)
      }

      if (user.role !== "admin") {
        return GETPIEDATA.respond(false, "Unauthorized access", null, 403)
      }

      const freeUsers = await AccountModel.countDocuments({
        plan: ACCOUNT_TYPES.FREE,
      })

      const paidUsers = await AccountModel.countDocuments({
        plan: ACCOUNT_TYPES.PRO,
      })

      const enterpriseUsers = await AccountModel.countDocuments({
        plan: ACCOUNT_TYPES.ENTERPRISE,
      })

      const pieData = [
        { name: "Free Users", value: freeUsers },
        { name: "Paid Users", value: paidUsers },
        { name: "Pro", value: enterpriseUsers },
      ]

      return GETPIEDATA.respond(
        true,
        "Pie chart data fetched successfully",
        pieData,
        200
      )
    } catch (error: unknown) {
      let errorMessage = "Unknown error"
      if (error instanceof Error) errorMessage = error.message
      if (typeof error === "string") errorMessage = error

      return GETPIEDATA.respond(false, errorMessage, null, 500)
    }
  }
}

async function GET(request: Request) {
  return await new GETPIEDATA().handle(request)
}

export { GET }
