import { connectDB } from "@/lib/db";
import { AccountModel, UserModel } from "@/entities";
import { ACCOUNT_TYPES, SUBSCRIPTION_STATUS } from "@/constants";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

const ALLOWED_PLANS = new Set([
  ACCOUNT_TYPES.PRO,
  ACCOUNT_TYPES.ENTERPRISE,
]);
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      plan?: string;
      billingCycle?: "monthly" | "yearly";
    };

    const selectedPlan = (body.plan || ACCOUNT_TYPES.PRO).toLowerCase();
    if (selectedPlan !== ACCOUNT_TYPES.PRO && selectedPlan !== ACCOUNT_TYPES.ENTERPRISE) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const billingCycle = body.billingCycle === "yearly" ? "yearly" : "monthly";

    const user = await UserModel.findById(session.user._id).exec();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let account = await AccountModel.findOne({ user: user._id }).exec();

    if (!account) {
      account = await AccountModel.create({
        user: user._id,
        plan: selectedPlan,
        subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
        isTrialActive: false,
        reportsUsed: 0,
        reportsLimit: 999999,
        githubAccessEnabled: true,
        subscriptionEndAt:
          billingCycle === "yearly"
            ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
            : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });
    } else {
      account.plan = selectedPlan;
      account.subscriptionStatus = SUBSCRIPTION_STATUS.ACTIVE;
      account.isTrialActive = false;
      account.subscriptionEndAt =
        billingCycle === "yearly"
          ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
          : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      account.reportsLimit = 999999;
      account.githubAccessEnabled = true;
      await account.save();
    }

    return NextResponse.json({
      success: true,
      message: "Subscription upgraded successfully.",
      data: {
        plan: account.plan,
        billingCycle,
        subscriptionStatus: account.subscriptionStatus,
        githubAccessEnabled: account.githubAccessEnabled,
      },
    });
  } catch (error) {
    console.error("Error upgrading account:", error);
    return NextResponse.json({ error: "Failed to upgrade account" }, { status: 500 });
  }
}

