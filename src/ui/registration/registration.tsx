"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "@/schemas";
import { useRegistration, useUsernameUniqueness } from "@/hooks";
import { useDebounceCallback } from "usehooks-ts";
import { Box } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import { RegistrationForm } from "@/views";
import { ShieldCheck, Users, Zap } from "lucide-react";
import { signIn } from "next-auth/react";

interface RegistrationPageProps {
  height?: string;
  width?: string;
}

const Registration = ({
  height = "h-screen",
  width = "w-[100vw]",
}: RegistrationPageProps) => {
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      persona: "",
    },
  });

  const {
    usernameForUserRegistration,
    setUsernameForUserRegistration,
    isRegistrationUnderProgress,
    registrationProcessResponse,
    registerUser,
  } = useRegistration();

  const {
    usernameUniquenessCheckingResponse,
    checkUsername,
    isCheckingUsernameUniquness,
  } = useUsernameUniqueness();

  const debouncingForUsername = useDebounceCallback((username: string) => {
    setUsernameForUserRegistration(username);
    if (username.trim().length > 1) {
      checkUsername(username);
    }
  }, 800);

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
              Scan smarter.
              <br />
              Stay secure.
            </h2>
            <p className="text-gray-100 mt-4 text-base leading-relaxed">
              Join thousands of security professionals using MSCAN to identify
              vulnerabilities before attackers do.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { icon: ShieldCheck, text: "Enterprise-grade security scanning" },
              { icon: Zap, text: "Real-time threat detection & alerts" },
              { icon: Users, text: "Trusted by 10,000+ professionals" },
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

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Create your{" "}
              <span className="text-3xl font-bold tracking-tight text-[#D97757]">
                Account
              </span>
            </h1>
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/user/dashboard" })}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-full py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                fill="#EA4335"
                d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
              />
              <path
                fill="#4285F4"
                d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"
              />
              <path
                fill="#FBBC05"
                d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"
              />
              <path
                fill="#34A853"
                d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or sign up with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <RegistrationForm
            form={form}
            usernameForUserRegistration={usernameForUserRegistration}
            debouncingForUsername={debouncingForUsername}
            isRegistrationUnderProgress={isRegistrationUnderProgress}
            registrationProcessResponse={registrationProcessResponse}
            registerUser={registerUser}
            usernameUniquenessCheckingResponse={
              usernameUniquenessCheckingResponse
            }
            isCheckingUsernameUniquness={isCheckingUsernameUniquness}
          />
          <p className="text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <a
              href="/auth"
              className="text-black font-medium underline underline-offset-2"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </Box>
  );
};

export { Registration };
