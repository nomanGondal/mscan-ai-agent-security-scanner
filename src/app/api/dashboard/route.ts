import { connectDB } from "@/lib/db";
import { ScanModel, UserModel, AccountModel } from "@/entities";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { ACCOUNT_TYPES } from "@/constants";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findById(session.user._id).exec();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let account = await AccountModel.findOne({ user: user._id }).exec();

    if (!account) {
      account = await AccountModel.create({
        user: user._id,
        plan: ACCOUNT_TYPES.FREE,
        reportsUsed: 0,
        reportsLimit: 3,
        isTrialActive: true,
      });
    }

    if (account.plan === ACCOUNT_TYPES.FREE && account.reportsLimit !== 3) {
      account.reportsLimit = 3;
      await account.save();
    }

    if (account.plan !== ACCOUNT_TYPES.FREE && !account.githubAccessEnabled) {
      account.githubAccessEnabled = true;
      await account.save();
    }

    // Get all scans for this user
    const scans = await ScanModel.find({ user: user._id })
      .sort({ createdAt: -1 })
      .exec();

    // Calculate metrics
    const totalScans = scans.length;
    const completedScans = scans.filter((s) => s.status === "completed").length;
    const totalIssues = scans.reduce(
      (sum, scan) => sum + (scan.issues?.length || 0),
      0,
    );

    const avgIssuesPerScan =
      completedScans > 0 ? (totalIssues / completedScans).toFixed(1) : 0;

    const totalCritical = scans.reduce(
      (sum, scan) => sum + (scan.severitySummary?.critical || 0),
      0,
    );
    const totalHigh = scans.reduce(
      (sum, scan) => sum + (scan.severitySummary?.high || 0),
      0,
    );
    const totalMedium = scans.reduce(
      (sum, scan) => sum + (scan.severitySummary?.medium || 0),
      0,
    );
    const totalLow = scans.reduce(
      (sum, scan) => sum + (scan.severitySummary?.low || 0),
      0,
    );

    // Get last 6 months data for chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData: Array<{
      month: string;
      scans: number;
      issues: number;
    }> = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1);

      const monthScans = scans.filter((s) => {
        const scanDate = s.createdAt ?? s.uploadedAt ?? new Date(0);
        return scanDate >= monthStart && scanDate < monthEnd;
      });

      const monthIssues = monthScans.reduce((sum, scan) => {
        return sum + (scan.issues?.length || 0);
      }, 0);

      monthlyData.push({
        month: monthStart.toLocaleDateString("en-US", { month: "short" }),
        scans: monthScans.length,
        issues: monthIssues,
      });
    }

    // Recent scans
    const recentScans = scans.slice(0, 5).map((scan) => ({
      id: scan._id,
      fileName: scan.fileName,
      issuesFound:
        (scan.severitySummary?.critical || 0) +
        (scan.severitySummary?.high || 0) +
        (scan.severitySummary?.medium || 0) +
        (scan.severitySummary?.low || 0),
      critical: scan.severitySummary?.critical || 0,
      date: scan.createdAt,
      status: scan.status,
    }));

    // ZIP-based usage limits for free plan
    const zipScansCompleted = scans.filter(
      (scan) =>
        scan.status === "completed" && (scan.scanSource || "zip") === "zip",
    ).length;
    const reportsLimit =
      account.plan === ACCOUNT_TYPES.FREE ? 3 : account.reportsLimit;
    const reportsUsed =
      account.plan === ACCOUNT_TYPES.FREE
        ? zipScansCompleted
        : account.reportsUsed;
    const scansRemaining =
      account.plan === ACCOUNT_TYPES.FREE
        ? Math.max(0, reportsLimit - reportsUsed)
        : null;
    const upgradeRequired =
      account.plan === ACCOUNT_TYPES.FREE && reportsUsed >= reportsLimit;
    const githubEnabled =
      account.plan !== ACCOUNT_TYPES.FREE || account.githubAccessEnabled;

    if (
      account.plan === ACCOUNT_TYPES.FREE &&
      account.reportsUsed !== reportsUsed
    ) {
      account.reportsUsed = reportsUsed;
      account.reportsLimit = reportsLimit;
      await account.save();
    }

    // Check if truly unlimited: only for paid plans with very high limits (999999 indicates unlimited)
    const isUnlimited = account.plan !== ACCOUNT_TYPES.FREE && account.reportsLimit >= 999999;

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalScans,
          avgIssuesPerScan,
          criticalIssues: totalCritical,
          scansRemaining,
          planName: account.plan,
          reportsUsed,
          reportsLimit,
          isUnlimited,
          upgradeRequired,
          githubEnabled,
        },
        chartsData: {
          monthlyTrend: monthlyData,
          severityDistribution: [
            { name: "Critical", value: totalCritical },
            { name: "High", value: totalHigh },
            { name: "Medium", value: totalMedium },
            { name: "Low", value: totalLow },
          ],
        },
        recentScans,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
