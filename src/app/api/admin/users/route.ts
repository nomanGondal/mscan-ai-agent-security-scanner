import { connectDB } from "@/lib/db";
import { UserModel, AccountModel } from "@/entities";
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

// GET: List all users with pagination and search
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role");

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await UserModel.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    // Enrich with account data
    const usersWithAccounts = await Promise.all(
      users.map(async (user: any) => {
        const account = await AccountModel.findOne({ user: user._id }).lean();
        return {
          ...user,
          account,
        };
      })
    );

    const total = await UserModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: usersWithAccounts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// PUT: Update user or their limits
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const adminCheck = await verifyAdmin(req);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const body = await req.json();
    const { userId, userData, accountData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Update user data
    if (userData) {
      const { password, ...safeUpdates } = userData;
      await UserModel.findByIdAndUpdate(userId, safeUpdates, { new: true });
    }

    // Update account/limits
    if (accountData) {
      await AccountModel.findOneAndUpdate({ user: userId }, accountData, {
        new: true,
      });
    }

    // Fetch updated user
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

// DELETE: Delete a user
export async function DELETE(req: NextRequest) {
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
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Prevent deleting yourself
    if (userId === adminCheck.userId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete user and related data
    await UserModel.findByIdAndDelete(userId);
    await AccountModel.deleteMany({ user: userId });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
