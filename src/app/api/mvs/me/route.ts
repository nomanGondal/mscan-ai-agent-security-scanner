import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { connect_db } from "@/settings"
import { UserModel } from "@/entities"
import { authOptions } from "../../auth/[...nextauth]/options"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401 }
      )
    }

    await connect_db()
    const user = await UserModel.findById(session.user._id).select(
      "-password -verificationCode -verificationCodeExpiry"
    )

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          persona: user.persona,
          role: user.role,
          isActive: user.isActive,
          isUserVerified: user.isUserVerified,
          profilePicture: user.profilePicture,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
