import { connectDB } from "@/lib/db"
import { ScanModel } from "@/entities"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/options"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)

    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const scan = await ScanModel.findById(id).exec()

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: scan,
    })
  } catch (error) {
    console.error("Error fetching scan:", error)
    return NextResponse.json({ error: "Failed to fetch scan" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)

    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    const scan = await ScanModel.findByIdAndUpdate(id, body, {
      new: true,
    }).exec()

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: scan,
    })
  } catch (error) {
    console.error("Error updating scan:", error)
    return NextResponse.json({ error: "Failed to update scan" }, { status: 500 })
  }
}
