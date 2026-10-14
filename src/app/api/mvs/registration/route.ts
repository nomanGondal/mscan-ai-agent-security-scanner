import { UserModel } from "@/entities/user.model";
import { sendVerificationCode } from "@/helpers/send-resend-email";
import { connect_db } from "@/settings";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

class USER_REGISTRATION {
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
    await connect_db();
    try {
      const methodCheckResult = USER_REGISTRATION.methodCheck(request);
      if (methodCheckResult) {
        return methodCheckResult;
      }

      const body = await request.json();
      const { username, email, password, fullName, persona } = body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const userByUsername = await UserModel.findOne({ username: username });
      console.log("data", body);
      if (userByUsername) {
        if (userByUsername.isUserVerified) {
          return USER_REGISTRATION.respond(
            false,
            "User already exist",
            null,
            400,
          );
        } else {
          const now = Date.now();
          if (
            userByUsername.verificationCodeExpiry &&
            userByUsername.verificationCodeExpiry.getTime() > now
          ) {
            return USER_REGISTRATION.respond(
              false,
              "Please verify. We have send the code.",
              null,
              400,
            );
          }

          const verifyCode = Math.floor(
            100000 + Math.random() * 900000,
          ).toString();
          const verificationCodeExpiry = new Date(now + 10 * 60 * 1000);
          userByUsername.verificationCode = verifyCode;
          userByUsername.verificationCodeExpiry = verificationCodeExpiry;
          await userByUsername.save();

          const resendResponse = await sendVerificationCode({
            username: userByUsername.username,
            email: userByUsername.email,
            otp: verifyCode,
          });

          if (!resendResponse.success) {
            return USER_REGISTRATION.respond(
              false,
              "Cannot send verification code",
              resendResponse.data ?? resendResponse.error,
              500,
            );
          } else {
            return USER_REGISTRATION.respond(
              true,
              "Verification code sent.",
              resendResponse.data,
              200,
            );
          }
        }
      }

      const userByEmail = await UserModel.findOne({ email: email });

      if (userByEmail) {
        if (userByEmail.isUserVerified) {
          return USER_REGISTRATION.respond(
            false,
            "User already exist.",
            null,
            400,
          );
        } else {
          const verifyCode = Math.floor(
            100000 + Math.random() * 900000,
          ).toString();
          const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
          userByEmail.verificationCode = verifyCode;
          userByEmail.verificationCodeExpiry = verificationCodeExpiry;
          await userByEmail.save();

          const resendResponseByEmail = await sendVerificationCode({
            username: userByEmail.username,
            email: userByEmail.email,
            otp: verifyCode,
          });

          if (!resendResponseByEmail.success) {
            return USER_REGISTRATION.respond(
              false,
              "Cannot send verification code",
              resendResponseByEmail.data ?? resendResponseByEmail.error,
              500,
            );
          } else {
            return USER_REGISTRATION.respond(
              true,
              "Verification Code sent.",
              resendResponseByEmail.data,
              200,
            );
          }
        }
      }

      const verificationCode = String(
        Math.floor(100000 + Math.random() * 900000),
      );
      const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        fullName,
        persona,
        verificationCode,
        verificationCodeExpiry,
      });

      await newUser.save();
      console.log("💾 Saved user ID:", newUser._id);
      console.log("💾 Saved username:", newUser.username);
      const resendResponseForNewUser = await sendVerificationCode({
        username: username,
        email: email,
        otp: verificationCode,
      });

      if (!resendResponseForNewUser.success) {
        return USER_REGISTRATION.respond(
          false,
          "Cannot send verification code",
          resendResponseForNewUser.data ?? resendResponseForNewUser.error,
          500,
        );
      } else {
        return USER_REGISTRATION.respond(
          true,
          "Account created. Verification Code sent.",
          resendResponseForNewUser.data,
          200,
        );
      }
    } catch (error: unknown) {
      let errorMessage = "unknown Error";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      if (typeof error === "string") {
        errorMessage = error;
      }
      return USER_REGISTRATION.respond(false, errorMessage, null, 500);
    }
  }
}

async function POST(request: Request) {
  const userRegistration = new USER_REGISTRATION();
  return await userRegistration.handle(request);
}

export { POST };
