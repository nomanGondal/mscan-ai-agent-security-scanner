import { UserModel } from "@/entities/user.model";
import { sendPasswordRecoveryEmail } from "@/helpers/send-password-recovery-email";
import { forgotPasswordRecoveryRequestSchema } from "@/schemas";
import { connect_db } from "@/settings";
import { NextResponse } from "next/server";

class PASSWORD_RECOVERY_REQUEST {
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

      const methodCheckResult = PASSWORD_RECOVERY_REQUEST.methodCheck(request);
      if (methodCheckResult) {
        return methodCheckResult;
      }

      const payload = await request.json();
      const parsed = forgotPasswordRecoveryRequestSchema.safeParse(payload);

      if (!parsed.success) {
        return PASSWORD_RECOVERY_REQUEST.respond(
          false,
          parsed.error.issues[0]?.message || "Invalid request",
          null,
          400,
        );
      }

      const { recoveryMode, identifier } = parsed.data;
      const normalizedIdentifier = identifier.trim();

      const user =
        recoveryMode === "email"
          ? await UserModel.findOne({
              email: normalizedIdentifier.toLowerCase(),
            })
          : await UserModel.findOne({ username: normalizedIdentifier });

      if (!user) {
        return PASSWORD_RECOVERY_REQUEST.respond(
          false,
          "User not found",
          null,
          404,
        );
      }

      const verificationCode = String(
        Math.floor(100000 + Math.random() * 900000),
      );
      const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

      user.verificationCode = verificationCode;
      user.verificationCodeExpiry = verificationCodeExpiry;
      await user.save();

      const emailResponse = await sendPasswordRecoveryEmail({
        username: user.username,
        email: user.email,
        otp: verificationCode,
      });

      if (!emailResponse.success) {
        return PASSWORD_RECOVERY_REQUEST.respond(
          false,
          "Cannot send password recovery code",
          emailResponse.data ?? emailResponse.error,
          500,
        );
      }

      return PASSWORD_RECOVERY_REQUEST.respond(
        true,
        "Recovery code sent to your email.",
        {
          username: user.username,
          email: user.email,
        },
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

      return PASSWORD_RECOVERY_REQUEST.respond(false, errorMessage, null, 500);
    }
  }
}

async function POST(request: Request) {
  const newInstance = new PASSWORD_RECOVERY_REQUEST();
  return await newInstance.handle(request);
}

export { POST };
