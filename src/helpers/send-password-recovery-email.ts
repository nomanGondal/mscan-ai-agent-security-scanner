import { PasswordRecoveryTemplate } from "@/email";
import { getResendClient } from "@/service-email/resend-call";
import { ResendType } from "./types/resend-types";

interface SendPasswordRecoveryEmailProps {
  email: string;
  username: string;
  otp: number | string;
}

const sendPasswordRecoveryEmail = async ({
  email,
  username,
  otp,
}: SendPasswordRecoveryEmailProps): Promise<ResendType> => {
  try {
    const resend = await getResendClient();

    const emailPayload = {
      from: "MSCAN <no-reply@mscan.me>",
      to: email,
      subject: "Your MSCAN password recovery code",
      react: PasswordRecoveryTemplate({
        username,
        otp,
      }),
    };

    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      return {
        success: false,
        message: error?.message || "Failed to send password recovery code.",
        statusCode: 400,
        timestamps: new Date().toISOString(),
      };
    }

    return {
      success: true,
      message: "Password recovery code sent successfully",
      statusCode: 200,
      timestamps: new Date().toISOString(),
      data,
    };
  } catch (error: unknown) {
    let errorName = "Error";
    let errorMessage = "Unknown Server Error";
    let errorStack: string | undefined = undefined;

    if (error instanceof Error) {
      errorName = error.name;
      errorMessage = error.message;
      errorStack = error.stack;
    }

    return {
      statusCode: 500,
      message: "Cannot send password recovery email",
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

export { sendPasswordRecoveryEmail };
