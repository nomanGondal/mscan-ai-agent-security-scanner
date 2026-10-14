import { UserModel } from "@/entities/user.model";
import { forgotPasswordRecoveryResetSchema } from "@/schemas";
import { connect_db } from "@/settings";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

class PASSWORD_RECOVERY_RESET {
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

  static methodCheck(request: Request) {
    if (request.method !== "POST") {
      return this.respond(false, "Method not allowed", null, 405);
    }
    return null;
  }

  async handle(request: Request) {
    try {
      await connect_db();

      const methodCheckResult = PASSWORD_RECOVERY_RESET.methodCheck(request);
      if (methodCheckResult) {
        return methodCheckResult;
      }

      const payload = await request.json();
      const parsed = forgotPasswordRecoveryResetSchema.safeParse(payload);

      if (!parsed.success) {
        return PASSWORD_RECOVERY_RESET.respond(
          false,
          parsed.error.issues[0]?.message || "Invalid request",
          null,
          400,
        );
      }

      const { recoveryMode, identifier, verificationCode, newPassword } =
        parsed.data;

      const user =
        recoveryMode === "email"
          ? await UserModel.findOne({ email: identifier.trim().toLowerCase() })
          : await UserModel.findOne({ username: identifier.trim() });

      if (!user) {
        return PASSWORD_RECOVERY_RESET.respond(
          false,
          "User not found",
          null,
          404,
        );
      }

      if (user.verificationCodeExpiry < new Date()) {
        return PASSWORD_RECOVERY_RESET.respond(
          false,
          "Verification code is expired",
          null,
          400,
        );
      }

      if (verificationCode !== user.verificationCode) {
        return PASSWORD_RECOVERY_RESET.respond(
          false,
          "Verification code is wrong",
          null,
          400,
        );
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return PASSWORD_RECOVERY_RESET.respond(
          false,
          "New password must be different from old password",
          null,
          400,
        );
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.verificationCode = "";
      user.verificationCodeExpiry = new Date(0);
      await user.save();

      return PASSWORD_RECOVERY_RESET.respond(
        true,
        "Password updated successfully",
        null,
        200,
      );
    } catch (error: unknown) {
      let errorMessage = "unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      if (typeof error === "string") {
        errorMessage = error;
      }

      return PASSWORD_RECOVERY_RESET.respond(false, errorMessage, null, 500);
    }
  }
}

async function POST(request: Request) {
  const newInstance = new PASSWORD_RECOVERY_RESET();
  return await newInstance.handle(request);
}

export { POST };
