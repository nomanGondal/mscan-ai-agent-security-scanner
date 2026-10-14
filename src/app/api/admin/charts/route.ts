import { connectDB } from "@/lib/db";
import { ScanModel, UserModel } from "@/entities";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";

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

// GET: Get chart data for visualizations
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const adminCheck = await verifyAdmin(req);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const chartType = searchParams.get("type") || "scans-trend";
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    if (chartType === "scans-trend") {
      // Daily scans trend
      const scansTrend = await ScanModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            count: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            failed: {
              $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ]);

      const formattedData = scansTrend.map((item: any) => ({
        date: `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`,
        total: item.count,
        completed: item.completed,
        failed: item.failed,
      }));

      return NextResponse.json({
        success: true,
        data: formattedData,
        type: "scans-trend",
      });
    }

    if (chartType === "severity-distribution") {
      // Severity distribution pie chart
      const severityDist = await ScanModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: null,
            critical: { $sum: "$severitySummary.critical" },
            high: { $sum: "$severitySummary.high" },
            medium: { $sum: "$severitySummary.medium" },
            low: { $sum: "$severitySummary.low" },
          },
        },
      ]);

      const total = severityDist[0] || { critical: 0, high: 0, medium: 0, low: 0 };
      const sum = total.critical + total.high + total.medium + total.low;

      const data = [
        {
          name: "Critical",
          value: total.critical,
          percentage: sum > 0 ? ((total.critical / sum) * 100).toFixed(2) : 0,
          color: "#7F1D1D",
        },
        {
          name: "High",
          value: total.high,
          percentage: sum > 0 ? ((total.high / sum) * 100).toFixed(2) : 0,
          color: "#DC2626",
        },
        {
          name: "Medium",
          value: total.medium,
          percentage: sum > 0 ? ((total.medium / sum) * 100).toFixed(2) : 0,
          color: "#EA580C",
        },
        {
          name: "Low",
          value: total.low,
          percentage: sum > 0 ? ((total.low / sum) * 100).toFixed(2) : 0,
          color: "#2563EB",
        },
      ];

      return NextResponse.json({
        success: true,
        data,
        type: "severity-distribution",
      });
    }

    if (chartType === "user-growth") {
      // Daily new users
      const userGrowth = await UserModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ]);

      let cumulativeCount = 0;
      const formattedData = userGrowth.map((item: any) => {
        cumulativeCount += item.count;
        return {
          date: `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`,
          newUsers: item.count,
          totalUsers: cumulativeCount,
        };
      });

      return NextResponse.json({
        success: true,
        data: formattedData,
        type: "user-growth",
      });
    }

    if (chartType === "scan-status") {
      // Scan status breakdown
      const statusBreakdown = await ScanModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const data = statusBreakdown.map((item: any) => ({
        status: item._id || "unknown",
        count: item.count,
      }));

      return NextResponse.json({
        success: true,
        data,
        type: "scan-status",
      });
    }

    return NextResponse.json(
      { error: "Invalid chart type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
