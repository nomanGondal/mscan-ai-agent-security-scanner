import { UserModel } from "@/entities"
import { usernameSchema } from "@/schemas"
import { connect_db } from "@/settings"
import { NextResponse } from "next/server"

class USERNAME_UNIQUE {
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
      return this.respond(false, "Method not allowed", null, 405)
    }
    return null
  }

  static Query_Params_Check(request: Request) {
    const { searchParams } = new URL(request.url)
    const rawUsername = searchParams.get("username") || ""
    const parsedData = usernameSchema.safeParse(rawUsername)
    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0].message)
    }
    return parsedData.data
  }

  async handle(request: Request) {
    try {
      await connect_db()
      const methodCheckResult = USERNAME_UNIQUE.MethodCheck(request)
      if (methodCheckResult) {
        return methodCheckResult
      }

      const username = USERNAME_UNIQUE.Query_Params_Check(request)
      const user = await UserModel.findOne({
        username: username,
      })
      if (!user) {
        return USERNAME_UNIQUE.respond(true, "username is unique.", null, 200)
      } else {
        return USERNAME_UNIQUE.respond(
          false,
          "username is not available.",
          null,
          400
        )
      }
    } catch (error: unknown) {
      let errorMessage = "unknown error"
      if (error instanceof Error) {
        errorMessage = error?.message
      }
      if (typeof error === "string") {
        errorMessage = error
      }
      return USERNAME_UNIQUE.respond(false, errorMessage, null, 500)
    }
  }
}

async function GET(request: Request) {
  const newInstanceForUniqueUsername = new USERNAME_UNIQUE()
  return await newInstanceForUniqueUsername.handle(request)
}

export { GET }
