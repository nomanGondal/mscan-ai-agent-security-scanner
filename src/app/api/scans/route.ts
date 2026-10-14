import { connectDB } from "@/lib/db";
import { ScanModel, UserModel, AccountModel } from "@/entities";
import { sendScanCompletionEmail } from "@/helpers/send-scan-completion-email";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { ACCOUNT_TYPES } from "@/constants";

const ensureFreePlanLimits = async (account: Awaited<ReturnType<typeof AccountModel.findOne>>) => {
  if (!account) {
    return;
  }

  if (account.plan === ACCOUNT_TYPES.FREE && account.reportsLimit !== 3) {
    account.reportsLimit = 3;
    await account.save();
  }
};

const maybeSendScanCompletionEmail = async (
  user: { email?: string | null; fullName?: string; username: string },
  scanSource: string,
  scan: {
    fileName: string;
    completedAt?: Date | null;
    duration?: number;
    severitySummary: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    issues?: Array<{
      severity: "critical" | "high" | "medium" | "low";
      type: string;
      description: string;
      stage?: "mcp_ast" | "pyre_typing" | "pysa_taint" | "unknown";
      line: number;
      column: number;
      file?: string;
      code?: string;
    }>;
  },
) => {
  if (!user.email) {
    return;
  }

  try {
    const emailResult = await sendScanCompletionEmail({
      email: user.email,
      username: user.fullName || user.username,
      fileName: scan.fileName,
      scanSource: scanSource as "zip" | "model" | "github" | "demo",
      completedAt: scan.completedAt || new Date(),
      durationMs: scan.duration,
      severitySummary: scan.severitySummary,
      issues: scan.issues || [],
    });

    if (!emailResult.success) {
      console.error("Scan completion email was not sent:", emailResult);
    }
  } catch (emailError) {
    console.error("Failed to send scan completion email:", emailError);
  }
};

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

    const scans = await ScanModel.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();

    return NextResponse.json({
      success: true,
      data: scans,
    });
  } catch (error) {
    console.error("Error fetching scans:", error);
    return NextResponse.json(
      { error: "Failed to fetch scans" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const user = await UserModel.findById(session.user._id).exec();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let account = await AccountModel.findOne({ user: user._id }).exec();

    account ??= await AccountModel.create({
        user: user._id,
        plan: ACCOUNT_TYPES.FREE,
        reportsUsed: 0,
        reportsLimit: 3,
        isTrialActive: true,
      });

    await ensureFreePlanLimits(account);

    const scanSource = String(body.scanSource || "zip").toLowerCase();
    const isZipScan = scanSource === "zip";
    const isFreePlan = account.plan === ACCOUNT_TYPES.FREE;

    // Check scan limits for all plans (not just free)
    const reportsUsed = (account.reportsUsed || 0);
    const reportsLimit = account.reportsLimit;
    
    if (isZipScan && reportsUsed >= reportsLimit) {
      return NextResponse.json(
        {
          success: false,
          error: `Scan limit reached. You've used ${reportsUsed}/${reportsLimit} scans. ${isFreePlan ? 'Please upgrade to Pro.' : 'Contact support to increase your limit.'}`,
          upgradeRequired: isFreePlan,
        },
        { status: 403 },
      );
    }

    const scan = await ScanModel.create({
      ...body,
      scanSource,
      user: user._id,
      account: account._id,
      status: body.status || "analyzing",
      completedAt:
        body.status === "completed"
          ? body.completedAt || new Date()
          : body.completedAt,
    });

    if (body.status === "completed" && isZipScan) {
      account.reportsUsed ??= 0;
      account.reportsUsed += 1;
      await account.save();
      await maybeSendScanCompletionEmail(user, scanSource, scan);
    }

    return NextResponse.json({
      success: true,
      data: scan,
    });
  } catch (error) {
    console.error("Error creating scan:", error);
    return NextResponse.json(
      { error: "Failed to create scan" },
      { status: 500 },
    );
  }
}
