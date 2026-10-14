import { connectDB } from "@/lib/db";
import { ScanModel, UserModel, AccountModel } from "@/entities";
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

// GET: Get analytics data
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

    // Total scans and vulnerabilities
    const totalScans = await ScanModel.countDocuments();
    const completedScans = await ScanModel.countDocuments({
      status: "completed",
    });
    const failedScans = await ScanModel.countDocuments({ status: "failed" });

    // Severity breakdown
    const severitySummary = await ScanModel.aggregate([
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

    // Scans by source
    const scansBySource = await ScanModel.aggregate([
      {
        $group: {
          _id: "$scanSource",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Top vulnerable files
    const topFiles = await ScanModel.aggregate([
      { $unwind: "$issues" },
      {
        $group: {
          _id: "$issues.file",
          count: { $sum: 1 },
          avgSeverity: { $avg: { $cond: [{ $eq: ["$issues.severity", "critical"] }, 4, { $cond: [{ $eq: ["$issues.severity", "high"] }, 3, { $cond: [{ $eq: ["$issues.severity", "medium"] }, 2, 1] }] }] } },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Most common vulnerability types
    const topVulnerabilities = await ScanModel.aggregate([
      { $unwind: "$issues" },
      {
        $group: {
          _id: "$issues.type",
          count: { $sum: 1 },
          severity: { $first: "$issues.severity" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // User engagement metrics
    const usersWithScans = await ScanModel.distinct("user");
    const activeUsers = usersWithScans.length;

    // Average scan duration
    const avgScanDuration = await ScanModel.aggregate([
      {
        $match: { duration: { $exists: true, $ne: null } },
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: "$duration" },
          maxDuration: { $max: "$duration" },
          minDuration: { $min: "$duration" },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalScans,
          completedScans,
          failedScans,
          successRate: totalScans > 0 ? ((completedScans / totalScans) * 100).toFixed(2) : 0,
          activeUsers,
        },
        severitySummary: severitySummary[0] || {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        },
        scansBySource,
        topFiles,
        topVulnerabilities,
        scanDuration: avgScanDuration[0] || {
          avgDuration: 0,
          maxDuration: 0,
          minDuration: 0,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
