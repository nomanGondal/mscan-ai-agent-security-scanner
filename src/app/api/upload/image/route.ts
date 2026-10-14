import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"
import { NextResponse } from "next/server"
import { cloudinary } from "@/config"
import { UserModel } from "@/entities"
import { connect_db } from "@/settings"

async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?._id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated." },
        { status: 401 }
      )
    }

    await connect_db()

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File not found." },
        { status: 400 }
      )
    }
    const user = await UserModel.findById(session.user._id)
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      )
    }
    if (user.profilePicture?.public_id) {
      try {
        await cloudinary.uploader.destroy(user.profilePicture.public_id)
      } catch (err) {
        console.error("Cloudinary delete failed:", err)
      }
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "avatars" },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(buffer)
    })
    user.profilePicture = {
      url: result.secure_url,
      public_id: result.public_id,
    }
    await user.save()
    return NextResponse.json(
      {
        success: true,
        message: "Profile image updated successfully",
        data: {
          url: result.secure_url,
        },
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    let errorMessage = "Unknown error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}

export { POST }
