import { connectDB } from "@/lib/db";
import { AccountModel, UserModel, ScanModel } from "@/entities";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { ACCOUNT_TYPES } from "@/constants";

export async function GET(_req: NextRequest) {
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

    const account = await AccountModel.findOne({ user: user._id }).populate(
      "user",
    );

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (account.plan === ACCOUNT_TYPES.FREE) {
      const completedZipScans = await ScanModel.countDocuments({
        user: user._id,
        status: "completed",
        scanSource: "zip",
      });

      const shouldSave =
        account.reportsLimit !== 3 || account.reportsUsed !== completedZipScans;
      account.reportsLimit = 3;
      account.reportsUsed = completedZipScans;

      if (shouldSave) {
        await account.save();
      }
    }

    return NextResponse.json({
      success: true,
      data: account,
    });
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
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

    const account = await AccountModel.findOneAndUpdate(
      { user: user._id },
      body,
      { new: true },
    );

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: account,
      message: "Account updated successfully",
    });
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 },
    );
  }
}
