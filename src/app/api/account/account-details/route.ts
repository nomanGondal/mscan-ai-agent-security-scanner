import { AccountModel, ScanModel } from "@/entities";
import { getCurrentUser } from "@/helpers";
import { NextResponse } from "next/server";
import { ACCOUNT_TYPES } from "@/constants";

class ACCOUNTDETAILS {
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
    if (request.method !== "GET") {
      return this.respond(false, "Method not allowed.", null, 405);
    }
    return null;
  }

  async handle(request: Request) {
    try {
      const methodCheckResult = ACCOUNTDETAILS.MethodCheck(request);
      if (methodCheckResult) {
        return methodCheckResult;
      }
      const user = await getCurrentUser();
      if (!user) {
        return ACCOUNTDETAILS.respond(false, "user not found.", null, 400);
      }
      let account = await AccountModel.findOne({ user }).exec();
      if (!account) {
        account = await AccountModel.create({
          user,
          plan: ACCOUNT_TYPES.FREE,
          reportsUsed: 0,
          reportsLimit: 3,
          isTrialActive: true,
        });
      }

      if (account.plan === ACCOUNT_TYPES.FREE) {
        const completedZipScans = await ScanModel.countDocuments({
          user,
          status: "completed",
          scanSource: "zip",
        });

        const shouldSave =
          account.reportsLimit !== 3 ||
          account.reportsUsed !== completedZipScans;
        account.reportsLimit = 3;
        account.reportsUsed = completedZipScans;

        if (shouldSave) {
          await account.save();
        }
      }

      return ACCOUNTDETAILS.respond(
        true,
        "Account details fetched.",
        account,
        200,
      );
    } catch (error: unknown) {
      let errorMessage = "unknown error";
      if (error instanceof Error) {
        errorMessage = error?.message;
      }
      if (typeof error === "string") {
        errorMessage = error;
      }

      return ACCOUNTDETAILS.respond(false, errorMessage, null, 500);
    }
  }
}

async function GET(request: Request) {
  const newAccountDetails = new ACCOUNTDETAILS();
  return await newAccountDetails.handle(request);
}

export { GET };
