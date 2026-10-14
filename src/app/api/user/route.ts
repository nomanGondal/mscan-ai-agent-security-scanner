import { connectDB } from "@/lib/db"
import { UserModel } from "@/entities"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/options"
import bcrypt from "bcrypt"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)

    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await UserModel.findById(session.user._id)
      .select("-password")
      .exec()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)

    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Don't allow direct password update via this endpoint
    const { password, email, ...updateData } = body

    const user = await UserModel.findOneAndUpdate(
      { _id: session.user._id },
      updateData,
      { new: true }
    )
      .select("-password")
      .exec()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}
