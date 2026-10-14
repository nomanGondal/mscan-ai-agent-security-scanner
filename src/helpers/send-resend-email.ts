import { VerificationTemplate } from "@/email";
import { getResendClient } from "@/service-email/resend-call";
import { ResendType } from "./types/resend-types";

interface sendVerificationCodeProps {
  email?: string;
  username: string;
  otp: number | string;
}

const sendVerificationCode = async ({
  email,
  username,
  otp,
}: sendVerificationCodeProps): Promise<ResendType> => {
  console.log("📨 [EMAIL] sendVerificationCode called");
  console.log("➡️ Payload:", { email, username, otp });

  try {
    const resend = await getResendClient();
    console.log("✅ Resend client initialized");

    const emailPayload = {
      from: "MSCAN <no-reply@mscan.me>",
      to: email ?? "",
      subject: "Your Verification Code",
      react: VerificationTemplate({
        username,
        otp,
      }),
    };

    console.log("📦 Sending email payload:", emailPayload);

    const { data, error } = await resend.emails.send(emailPayload);

    console.log("📬 Resend response data:", data);
    console.log("⚠️ Resend error:", error);

    if (error) {
      console.error("❌ EMAIL SEND FAILED (Resend error):", error);

      return {
        success: false,
        message: error?.message || "Failed to send Verification Code.",
        statusCode: 400,
        timestamps: new Date().toISOString(),
      };
    }

    console.log("✅ EMAIL SENT SUCCESSFULLY");

    return {
      success: true,
      message: "Verification code sent successfully",
      statusCode: 200,
      timestamps: new Date().toISOString(),
      data,
    };
  } catch (error: unknown) {
    console.error("🔥 EMAIL SEND EXCEPTION OCCURRED");

    let errorName = "Error";
    let errorMessage = "Unknown Server Error";
    let errorStack: string | undefined = undefined;

    if (error instanceof Error) {
      errorName = error.name;
      errorMessage = error.message;
      errorStack = error.stack;
    }

    console.error("❌ ERROR DETAILS:", {
      name: errorName,
      message: errorMessage,
      stack: errorStack,
    });

    return {
      statusCode: 500,
      message: "Cannot send email network error",
      success: false,
      timestamps: new Date().toISOString(),
      error: {
        name: errorName,
        message: errorMessage,
        stack: errorStack,
      },
    };
  }
};

export { sendVerificationCode };
