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

    const account = await AccountModel.findOne({ user: user._id }).exec();

    // Get all completed scans for this user
    const scans = await ScanModel.find({ user: user._id })
      .sort({ createdAt: -1 })
      .exec();

    const completedScans = scans.filter((s) => s.status === "completed");

    // ─── 1. Risk Score ────────────────────────────────────────────────────────
    // Weighted: critical=10, high=5, medium=2, low=1 → normalised to 0-100
    const totalCritical = scans.reduce(
      (sum, s) => sum + (s.severitySummary?.critical || 0),
      0,
    );
    const totalHigh = scans.reduce(
      (sum, s) => sum + (s.severitySummary?.high || 0),
      0,
    );
    const totalMedium = scans.reduce(
      (sum, s) => sum + (s.severitySummary?.medium || 0),
      0,
    );
    const totalLow = scans.reduce(
      (sum, s) => sum + (s.severitySummary?.low || 0),
      0,
    );

    const rawScore =
      totalCritical * 10 + totalHigh * 5 + totalMedium * 2 + totalLow * 1;
    // Cap at 200 raw pts → maps to 100; anything beyond stays 100
    const riskScore = Math.min(100, Math.round(rawScore / 2));
    const riskLabel =
      riskScore >= 75
        ? "Critical"
        : riskScore >= 50
          ? "High"
          : riskScore >= 25
            ? "Medium"
            : "Low";

    // ─── 2. Most Vulnerable Files ─────────────────────────────────────────────
    const fileIssueMap: Record<string, { issues: number; critical: number }> =
      {};

    for (const scan of completedScans) {
      const issues: Array<{
        file?: string;
        filePath?: string;
        severity?: string;
      }> = scan.issues || [];
      for (const issue of issues) {
        const filePath = issue.file || issue.filePath || "unknown";
        if (!fileIssueMap[filePath]) {
          fileIssueMap[filePath] = { issues: 0, critical: 0 };
        }
        fileIssueMap[filePath].issues += 1;
        if (issue.severity?.toLowerCase() === "critical") {
          fileIssueMap[filePath].critical += 1;
        }
      }
    }

    const mostVulnerableFiles = Object.entries(fileIssueMap)
      .sort((a, b) => b[1].issues - a[1].issues)
      .slice(0, 5)
      .map(([file, data]) => ({
        file: file.split("/").slice(-2).join("/"), // keep last 2 path parts
        fullPath: file,
        issues: data.issues,
        critical: data.critical,
      }));

    // ─── 3. Top Vulnerability Rules ───────────────────────────────────────────
    const ruleMap: Record<string, number> = {};

    for (const scan of completedScans) {
      const issues: Array<{ rule?: string; ruleId?: string; type?: string }> =
        scan.issues || [];
      for (const issue of issues) {
        const rule = issue.rule || issue.ruleId || issue.type || "UNKNOWN";
        ruleMap[rule] = (ruleMap[rule] || 0) + 1;
      }
    }

    const topVulnerabilityRules = Object.entries(ruleMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([rule, count]) => ({ rule, count }));

    // ─── 4. Scanner Pipeline Health (24h uptime strip) ────────────────────────
    // Build 24 hourly buckets: 1 = scan ran successfully, 0 = no activity/error
    const now = new Date();
    const hourlyHealth: Array<{
      hour: string;
      status: "up" | "idle" | "error";
    }> = [];

    for (let i = 23; i >= 0; i--) {
      const hourStart = new Date(now);
      hourStart.setHours(now.getHours() - i, 0, 0, 0);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourStart.getHours() + 1);

      const hourScans = scans.filter((s) => {
        const d = s.createdAt ?? s.uploadedAt ?? new Date(0);
        return d >= hourStart && d < hourEnd;
      });

      const hasError = hourScans.some((s) => s.status === "failed");
      const hasSuccess = hourScans.some((s) => s.status === "completed");

      hourlyHealth.push({
        hour: hourStart.toLocaleTimeString("en-US", {
          hour: "2-digit",
          hour12: false,
        }),
        status: hasError ? "error" : hasSuccess ? "up" : "idle",
      });
    }

    const recentActivity = scans.slice(0, 10).map((scan) => {
      const totalIssues =
        (scan.severitySummary?.critical || 0) +
        (scan.severitySummary?.high || 0) +
        (scan.severitySummary?.medium || 0) +
        (scan.severitySummary?.low || 0);

      const createdAt = scan.createdAt ?? scan.uploadedAt ?? new Date();
      const diffMs = Date.now() - new Date(createdAt).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const timeAgo =
        diffMins < 1
          ? "just now"
          : diffMins < 60
            ? `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
            : diffMins < 1440
              ? `${Math.floor(diffMins / 60)}h ago`
              : `${Math.floor(diffMins / 1440)}d ago`;

      return {
        id: scan._id,
        fileName: scan.fileName || "Unknown file",
        issuesFound: totalIssues,
        critical: scan.severitySummary?.critical || 0,
        status: scan.status,
        timeAgo,
        createdAt,
      };
    });

    // ─── 6. Scan Duration Trend ───────────────────────────────────────────────
    // Use last 10 completed scans. duration in seconds if available, else estimate.
    const scanDurationTrend = completedScans
      .slice(0, 10)
      .reverse()
      .map((scan, idx) => {
        const duration =
          scan.duration ||
          (scan.completedAt && scan.createdAt
            ? Math.round(
                (new Date(scan.completedAt).getTime() -
                  new Date(scan.createdAt).getTime()) /
                  1000,
              )
            : null);

        return {
          index: idx + 1,
          fileName: (scan.fileName || "Scan").split(".")[0].slice(0, 12),
          durationSeconds: duration,
        };
      });

    return NextResponse.json({
      success: true,
      data: {
        riskScore: {
          score: riskScore,
          label: riskLabel,
          breakdown: {
            critical: totalCritical,
            high: totalHigh,
            medium: totalMedium,
            low: totalLow,
          },
        },
        mostVulnerableFiles,
        topVulnerabilityRules,
        hourlyHealth,
        recentActivity,
        scanDurationTrend,
      },
    });
  } catch (error) {
    console.error("Error fetching extended dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch extended dashboard data" },
      { status: 500 },
    );
  }
}
