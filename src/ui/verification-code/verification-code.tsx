"use client";

import { Box } from "@radix-ui/themes";
import React from "react";
import { cn, QueryParams, showToast } from "@/utiils";
import { VerificationView } from "@/views";
import { useForm } from "react-hook-form";
import { verifyCodeSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVerificationCode } from "@/hooks";
import { QUERY_PARAMS } from "@/constants";
import { ShieldCheck, Lock, Mail } from "lucide-react";

const VerificationCode = ({ height = "h-screen", width = "w-[100vw]" }) => {
  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { verificationCode: "" },
  });

  const username = QueryParams({
    key: QUERY_PARAMS.USERNAME,
    defaultValue: QUERY_PARAMS.GUEST,
  });

  const { verificationProcessResponse, isVerifyingCode, verificationCode } =
    useVerificationCode();

  const handleVerification = async (data: z.infer<typeof verifyCodeSchema>) => {
    if (!username || username === QUERY_PARAMS.GUEST) {
      showToast("Invalid session. Please signup again.", "error");
      return;
    }
    await verificationCode({
      verificationCode: data.verificationCode.trim(),
      username,
    });
  };

  return (
    <Box className={cn(height, width, "flex")}>
      {/* Left branding panel */}
      <div className="hidden lg:flex w-1/2 bg-[#1F1F1E] flex-col justify-between p-12">
        <div>
          <span className="text-[#D97757] text-6xl font-bold tracking-tight border-b-8 border-white ">
            MSCAN
          </span>
        </div>
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-white text-4xl font-semibold leading-tight">
              Almost there.
              <br />
              Check your inbox.
            </h2>
            <p className="text-gray-100 mt-4 text-base leading-relaxed">
              We sent a verification code to confirm your identity and secure
              your account.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { icon: Mail, text: "Code sent to your registered email" },
              { icon: Lock, text: "Valid for 10 minutes only" },
              { icon: ShieldCheck, text: "Keeps your account secure" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-[#D97757] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#D97757]" />
                </div>
                <span className="text-white text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-200 text-sm">
          © 2025 MSCAN. All rights reserved.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <VerificationView
            form={form}
            verificationProcessResponse={verificationProcessResponse}
            isVerifyingCode={isVerifyingCode}
            verificationCode={handleVerification}
          />
        </div>
      </div>
    </Box>
  );
};

export { VerificationCode };
