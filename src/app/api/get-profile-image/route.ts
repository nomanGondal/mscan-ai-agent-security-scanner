import { getCurrentUser } from "@/helpers"
import { NextResponse } from "next/server"

class GETUSERPROFILEPICTURE {
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
      return this.respond(false, "Method not allowed", null, 405)
    }
  }

  async handle(request: Request) {
    try {
      const methodCheckResult = GETUSERPROFILEPICTURE.methodCheck(request)
      if (methodCheckResult) {
        return methodCheckResult
      }
      const user = await getCurrentUser()
      if (!user) {
        return GETUSERPROFILEPICTURE.respond(false, "User not found.", null, 400)
      }
      return GETUSERPROFILEPICTURE.respond(
        true,
        "Profile picture fetchec",
        user?.profilePicture?.url,
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
      return GETUSERPROFILEPICTURE.respond(false, "Server Error", null, 500)
    }
  }
}

async function GET(request: Request) {
  const newInstance = new GETUSERPROFILEPICTURE()
  return await newInstance.handle(request)
}

export { GET }
