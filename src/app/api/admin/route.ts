import { connectDB } from "@/lib/db";
import { UserModel, AccountModel, ScanModel } from "@/entities";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

// Helper to verify admin role
async function verifyAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    return {
      isAdmin: false,
      error: "Unauthorized",
      status: 401,
    };
  }

  const user = await UserModel.findById(session.user._id);

  if (user?.role !== "admin") {
    return {
      isAdmin: false,
      error: "Forbidden - Admin access required",
      status: 403,
    };
  }

  return {
    isAdmin: true,
    userId: session.user._id,
  };
}

// GET: Admin dashboard overview
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const adminCheck = await verifyAdmin(req);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status },
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query");

    // Get overview stats
    const totalUsers = await UserModel.countDocuments();
    const totalAdmins = await UserModel.countDocuments({ role: "admin" });
    const totalScans = await ScanModel.countDocuments();

    // Get subscription breakdown
    const subscriptionStats = await AccountModel.aggregate([
      {
        $group: {
          _id: "$plan",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent scans
    const recentScans = await ScanModel.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get active subscriptions
    const activeSubscriptions = await AccountModel.countDocuments({
      subscriptionStatus: "active",
    });

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalAdmins,
          totalScans,
          activeSubscriptions,
        },
        subscriptionStats,
        recentScans,
      },
    });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
