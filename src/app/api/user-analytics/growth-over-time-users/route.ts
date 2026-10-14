// app/api/user-analytics/growth/route.ts
import { UserModel } from "@/entities"
import { getCurrentUser } from "@/helpers"
import { NextResponse } from "next/server"
import mongoose from "mongoose"

class GETGROWTH {
  static respond(
    success: boolean,
    message: string,
    data: unknown = null,
    status: number = 200
  ) {
    return NextResponse.json({ success, message, data }, { status })
  }

  static async handle(request: Request) {
    if (request.method !== "GET") {
      return this.respond(false, "Method not allowed", null, 405)
    }

    try {
      const user = await getCurrentUser()
      if (!user) return this.respond(false, "Unauthorized", null, 401)
      if (user.role !== "admin")
        return this.respond(false, "Forbidden", null, 403)

      const now = new Date()
      const labels: string[] = []
      const data: number[] = []

      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

        const count = await UserModel.countDocuments({
          createdAt: { $gte: start, $lt: end },
        })

        labels.push(
          start.toLocaleString("default", { month: "short", year: "2-digit" })
        )
        data.push(count)
      }

      const chartData = labels.map((label, index) => ({
        month: label,
        users: data[index],
      }))

      return this.respond(true, "Growth data fetched", chartData)
    } catch (error: unknown) {
      let errorMessage = "Unknown error"
      if (error instanceof Error) errorMessage = error.message
      return this.respond(false, errorMessage, null, 500)
    }
  }
}

async function GET(request: Request) {
  return await GETGROWTH.handle(request)
}

export { GET }
