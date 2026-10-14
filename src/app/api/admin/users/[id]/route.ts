import { connectDB } from "@/lib/db";
import { UserModel, AccountModel, ScanModel } from "@/entities";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/options";

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

// GET: Get detailed info about a specific user
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const adminCheck = await verifyAdmin(req);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const userId = params.id;

    // Get user info
    const user = await UserModel.findById(userId)
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get account info
    const account = await AccountModel.findOne({ user: userId }).lean();

    // Get user's scan statistics
    const scans = await ScanModel.find({ user: userId }).lean();
    const totalScans = scans.length;

    const severitySummary = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    scans.forEach((scan: any) => {
      if (scan.severitySummary) {
        severitySummary.critical += scan.severitySummary.critical || 0;
        severitySummary.high += scan.severitySummary.high || 0;
        severitySummary.medium += scan.severitySummary.medium || 0;
        severitySummary.low += scan.severitySummary.low || 0;
      }
    });

    // Get usage percentage
    const usagePercentage = account
      ? (account.reportsUsed / account.reportsLimit) * 100
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        user,
        account,
        stats: {
          totalScans,
          severitySummary,
          usagePercentage: Math.round(usagePercentage),
          reportsUsed: account?.reportsUsed || 0,
          reportsLimit: account?.reportsLimit || 0,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}

// PUT: Update user limits or status
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const adminCheck = await verifyAdmin(req);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const userId = params.id;
    const body = await req.json();
    const { reportsLimit, plan, subscriptionStatus, isActive } = body;

    // Update account limits if provided
    if (reportsLimit !== undefined || plan || subscriptionStatus !== undefined) {
      await AccountModel.findOneAndUpdate(
        { user: userId },
        {
          ...(reportsLimit !== undefined && { reportsLimit }),
          ...(plan && { plan }),
          ...(subscriptionStatus !== undefined && { subscriptionStatus }),
        },
        { new: true }
      );
    }

    // Update user active status if provided
    if (isActive !== undefined) {
      await UserModel.findByIdAndUpdate(userId, { isActive }, { new: true });
    }

    // Fetch updated data
    const user = await UserModel.findById(userId)
      .select("-password")
      .lean();
    const account = await AccountModel.findOne({ user: userId }).lean();

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        account,
      },
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
