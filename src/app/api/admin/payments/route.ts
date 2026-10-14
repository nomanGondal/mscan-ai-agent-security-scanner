import { connectDB } from "@/lib/db";
import { AccountModel, UserModel } from "@/entities";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";

// Plan pricing configuration
const PLAN_PRICING: Record<string, number> = {
  free: 0,
  pro: 99,
  enterprise: 299, // Default estimate for enterprise (can be customized)
};

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

// GET: Get all payments and subscriptions
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {
      subscriptionStatus: { $ne: "none" },
    };

    if (status) {
      query.subscriptionStatus = status;
    }

    // Get subscriptions with user info
    const subscriptions = await AccountModel.find(query)
      .populate("user", "username email fullName")
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 })
      .lean();

    const total = await AccountModel.countDocuments(query);

    // Calculate statistics
    const activeCount = await AccountModel.countDocuments({
      subscriptionStatus: "active",
    });

    const pastDueCount = await AccountModel.countDocuments({
      subscriptionStatus: "past_due",
    });

    const cancelledCount = await AccountModel.countDocuments({
      subscriptionStatus: "cancelled",
    });

    // Calculate revenue breakdown by plan
    const planBreakdown = await AccountModel.aggregate([
      {
        $match: { subscriptionStatus: "active" },
      },
      {
        $group: {
          _id: "$plan",
          count: { $sum: 1 },
        },
      },
    ]);

    // Calculate total revenue from all paid accounts (excluding free)
    let totalRevenue = 0;
    let activeRevenue = 0;

    const allPaidAccounts = await AccountModel.find({
      subscriptionStatus: { $ne: "none" },
      plan: { $ne: "free" },
    }).lean();

    const activePaidAccounts = await AccountModel.find({
      subscriptionStatus: "active",
      plan: { $ne: "free" },
    }).lean();

    // Calculate total revenue
    allPaidAccounts.forEach((account: any) => {
      const planPrice = PLAN_PRICING[account.plan.toLowerCase()] || 0;
      totalRevenue += planPrice;
    });

    // Calculate active revenue
    activePaidAccounts.forEach((account: any) => {
      const planPrice = PLAN_PRICING[account.plan.toLowerCase()] || 0;
      activeRevenue += planPrice;
    });

    // Calculate average revenue per customer
    const totalCustomers = await AccountModel.countDocuments({
      subscriptionStatus: { $ne: "none" },
    });
    const averageRevenuePerCustomer =
      totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    // Calculate monthly recurring revenue (MRR) from active accounts
    const monthlyRecurringRevenue = activeRevenue;

    return NextResponse.json({
      success: true,
      data: subscriptions,
      stats: {
        total,
        activeCount,
        pastDueCount,
        cancelledCount,
        planBreakdown,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        activeRevenue: parseFloat(activeRevenue.toFixed(2)),
        averageRevenuePerCustomer: parseFloat(
          averageRevenuePerCustomer.toFixed(2),
        ),
        monthlyRecurringRevenue: parseFloat(monthlyRecurringRevenue.toFixed(2)),
      },
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}
