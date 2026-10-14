"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AUTH } from "@/constants";
import { verifyCodeSchema } from "@/schemas";
import { AuthStatus } from "@/types";
import { showToast, useNavigation } from "@/utiils";
import { Box } from "@radix-ui/themes";
import { Loader2, ShieldCheck } from "lucide-react";
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface VERIFICATIONVIEWPROPS {
  form: UseFormReturn<z.infer<typeof verifyCodeSchema>>;
  verificationProcessResponse: AuthStatus;
  isVerifyingCode: boolean;
  verificationCode: (
    data: z.infer<typeof verifyCodeSchema>,
  ) => Promise<any> | void;
}

const VerificationView = ({
  form,
  verificationProcessResponse,
  isVerifyingCode,
  verificationCode,
}: VERIFICATIONVIEWPROPS) => {
  const otpLength = 6;
  const separatorIndex = 3;
  const { navigateTo } = useNavigation();

  const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {
    try {
      const cleaned = data.verificationCode.trim();
      if (cleaned.length !== 6) {
        showToast("Please enter valid 6-digit code", "error");
        return;
      }
      await verificationCode({ verificationCode: cleaned });
    } catch {
      showToast("Verification Failed.", "error");
    }
  };

  useEffect(() => {
    if (verificationProcessResponse.success) {
      showToast(verificationProcessResponse.success, "success");
      setTimeout(() => navigateTo(AUTH), 1000);
    }
    if (verificationProcessResponse.error) {
      showToast(verificationProcessResponse.error, "error");
    }
  }, [verificationProcessResponse]);

  return (
    <Box className="w-full max-w-md mx-auto">
      <div className="border rounded-2xl p-8 flex flex-col items-center gap-6 bg-white shadow-sm">
        {/* Icon + Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#D97757] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Verify your email
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Enter the 6-digit code we sent to your email address.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col items-center gap-6"
          >
            <FormField
              name="verificationCode"
              control={form.control}
              render={({ field }) => (
                <FormControl>
                  <InputOTP
                    maxLength={otpLength}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup className="flex gap-2 justify-center">
                      {Array.from({ length: otpLength }).map((_, i) => (
                        <React.Fragment key={i}>
                          {i === separatorIndex && <InputOTPSeparator />}
                          <InputOTPSlot
                            index={i}
                            className="h-12 w-12 text-lg border border-gray-300 rounded-lg focus:border-black focus:ring-0"
                          />
                        </React.Fragment>
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
              )}
            />

            <Button
              type="submit"
              disabled={isVerifyingCode}
              className="w-full h-11 rounded-full bg-[#D97757] hover:bg-gray-900 cursor-pointer text-white font-medium"
            >
              {isVerifyingCode ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Verify code"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-xs text-gray-400 text-center">
          Didn't receive a code?{" "}
          <button className="text-black underline underline-offset-2 font-medium">
            Resend
          </button>
        </p>
      </div>
    </Box>
  );
};

export { VerificationView };
