import { AccountModel } from "@/entities";
import { UserModel } from "@/entities/user.model";
import { verificationCodeSchema } from "@/schemas";
import { connect_db } from "@/settings";
import { NextResponse } from "next/server";

interface VERIFY_CODE_ACCOUNT_CREATIONPROPS {
  username: string;
  verificationCode: string;
}

class VERIFY_CODE_ACCOUNT_CREATION {
  static respond(
    success: boolean,
    message: string,
    data: unknown = null,
    status: number = 200,
  ) {
    return NextResponse.json(
      {
        success,
        message,
        data,
      },
      {
        status,
      },
    );
  }

  static MethodCheck(request: Request) {
    if (request.method !== "POST") {
      return this.respond(false, "Method not allowed", null, 405);
    }
    return null;
  }
  static QueryParamsCheck(request: Request): VERIFY_CODE_ACCOUNT_CREATIONPROPS {
    const { searchParams } = new URL(request.url);
    const rawDataFromParams = {
      username: searchParams.get("username") || "",
      verificationCode: searchParams.get("verificationCode") || "",
    };
    const parsed = verificationCodeSchema.safeParse(rawDataFromParams);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0].message);
    }

    return parsed.data;
  }
  async handle(request: Request) {
    try {
      await connect_db();
      const methodCheckResult =
        VERIFY_CODE_ACCOUNT_CREATION.MethodCheck(request);
      if (methodCheckResult) {
        return methodCheckResult;
      }
      const { username, verificationCode } =
        VERIFY_CODE_ACCOUNT_CREATION.QueryParamsCheck(request);
      const user = await UserModel.findOne({
        username: username,
      });
      console.log("🔍 Searching for username:", JSON.stringify(username));
      console.log("👤 Found user:", user);

      if (!user) {
        return VERIFY_CODE_ACCOUNT_CREATION.respond(
          false,
          "User not found",
          null,
          400,
        );
      }
      const userVerificationCode = user.verificationCode;
      if (user.verificationCodeExpiry < new Date()) {
        return VERIFY_CODE_ACCOUNT_CREATION.respond(
          false,
          "Verification code is expired",
          null,
          400,
        );
      }
      if (user.isUserVerified) {
        return VERIFY_CODE_ACCOUNT_CREATION.respond(
          false,
          "User already verified",
          null,
          400,
        );
      }
      if (verificationCode === userVerificationCode) {
        user.isUserVerified = true;
        // user.verificationCode = ""
        await user.save();
        const newFreeAccount = await AccountModel.create({
          user: user._id,
        });
        return VERIFY_CODE_ACCOUNT_CREATION.respond(
          true,
          "User verification completed.",
          newFreeAccount,
          200,
        );
      } else {
        return VERIFY_CODE_ACCOUNT_CREATION.respond(
          false,
          "Verification code is wrong",
          null,
          400,
        );
      }
    } catch (error: unknown) {
      let errorMessage = "unknown error";
      if (error instanceof Error) {
        errorMessage = error?.message;
      }
      if (typeof error === "string") {
        errorMessage = error;
      }
      return VERIFY_CODE_ACCOUNT_CREATION.respond(
        false,
        errorMessage,
        null,
        500,
      );
    }
  }
}

async function POST(request: Request) {
  const newInstanceForVERIFY_CODE = new VERIFY_CODE_ACCOUNT_CREATION();
  return await newInstanceForVERIFY_CODE.handle(request);
}

export { POST };
