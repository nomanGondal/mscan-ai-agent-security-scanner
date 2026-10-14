"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AUTH } from "@/constants";
import {
  forgotPasswordRecoveryRequestSchema,
  forgotPasswordRecoveryResetSchema,
} from "@/schemas";
import { AuthStatus } from "@/types";
import { cn, showToast, useNavigation } from "@/utiils";
import { Box } from "@radix-ui/themes";
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordRecoveryCode, resetPasswordRecovery } from "@/services";

type RecoveryMode = "username" | "email";

interface ForgotPasswordProps {
  height?: string;
  width?: string;
}

const ForgotPassword = ({
  height = "h-screen",
  width = "w-[100vw]",
}: ForgotPasswordProps) => {
  const { navigateTo } = useNavigation();
  const [recoveryMode, setRecoveryMode] = useState<RecoveryMode>("username");
  const [submittedIdentifier, setSubmittedIdentifier] = useState("");
  const [isRecoveryCodeSent, setIsRecoveryCodeSent] = useState(false);
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [requestStatus, setRequestStatus] = useState<AuthStatus>({
    success: "",
    error: "",
  });
  const [resetStatus, setResetStatus] = useState<AuthStatus>({
    success: "",
    error: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const requestForm = useForm<
    z.infer<typeof forgotPasswordRecoveryRequestSchema>
  >({
    resolver: zodResolver(forgotPasswordRecoveryRequestSchema),
    defaultValues: {
      recoveryMode: "username",
      identifier: "",
    },
  });

  const resetForm = useForm<z.infer<typeof forgotPasswordRecoveryResetSchema>>({
    resolver: zodResolver(forgotPasswordRecoveryResetSchema),
    defaultValues: {
      recoveryMode: "username",
      identifier: "",
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  requestForm.register("recoveryMode");
  resetForm.register("recoveryMode");

  useEffect(() => {
    if (requestStatus.success) {
      showToast(requestStatus.success, "success");
    }
    if (requestStatus.error) {
      showToast(requestStatus.error, "error");
    }
  }, [requestStatus]);

  useEffect(() => {
    if (resetStatus.success) {
      showToast(resetStatus.success, "success");
      setTimeout(() => navigateTo(AUTH), 1000);
    }
    if (resetStatus.error) {
      showToast(resetStatus.error, "error");
    }
  }, [resetStatus, navigateTo]);

  const resetFlow = (mode: RecoveryMode = recoveryMode) => {
    setIsRecoveryCodeSent(false);
    setSubmittedIdentifier("");
    requestForm.reset({
      recoveryMode: mode,
      identifier: "",
    });
    resetForm.reset({
      recoveryMode: mode,
      identifier: "",
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
    });
    requestForm.setValue("recoveryMode", mode);
    resetForm.setValue("recoveryMode", mode);
  };

  const switchRecoveryMode = (mode: RecoveryMode) => {
    setRecoveryMode(mode);
    resetFlow(mode);
  };

  const handleResendCode = async () => {
    if (!submittedIdentifier) {
      setIsRecoveryCodeSent(false);
      return;
    }

    setRequestStatus({ success: "", error: "" });
    setIsRequestingCode(true);

    const response = await requestPasswordRecoveryCode({
      recoveryMode,
      identifier: submittedIdentifier,
    });

    if (response.success) {
      setRequestStatus({ success: response.message, error: "" });
      setIsRecoveryCodeSent(true);
    } else {
      setRequestStatus({ success: "", error: response.message });
    }

    setIsRequestingCode(false);
  };

  const onRequestCode = async (
    data: z.infer<typeof forgotPasswordRecoveryRequestSchema>,
  ) => {
    setRequestStatus({ success: "", error: "" });
    setIsRequestingCode(true);

    const identifier = data.identifier.trim();
    const response = await requestPasswordRecoveryCode({
      recoveryMode,
      identifier,
    });

    if (response.success) {
      setSubmittedIdentifier(identifier);
      setIsRecoveryCodeSent(true);
      setResetStatus({ success: "", error: "" });
      resetForm.reset({
        recoveryMode,
        identifier,
        verificationCode: "",
        newPassword: "",
        confirmPassword: "",
      });
      setRequestStatus({ success: response.message, error: "" });
    } else {
      setRequestStatus({ success: "", error: response.message });
    }

    setIsRequestingCode(false);
  };

  const onResetPassword = async (
    data: z.infer<typeof forgotPasswordRecoveryResetSchema>,
  ) => {
    setResetStatus({ success: "", error: "" });
    setIsResettingPassword(true);

    const response = await resetPasswordRecovery({
      recoveryMode,
      identifier: submittedIdentifier,
      verificationCode: data.verificationCode.trim(),
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });

    if (response.success) {
      setResetStatus({ success: response.message, error: "" });
      resetForm.reset({
        recoveryMode,
        identifier: submittedIdentifier,
        verificationCode: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setResetStatus({ success: "", error: response.message });
    }

    setIsResettingPassword(false);
  };

  const titleText = recoveryMode === "username" ? "username" : "email";
  const inputPlaceholder =
    recoveryMode === "username"
      ? "enter your username..."
      : "enter your email...";
  const otpSlots = [1, 2, 3, 4, 5, 6];

  return (
    <Box className={cn(height, width, "flex")}>
      <div className="hidden lg:flex w-1/2 bg-[#1F1F1E] flex-col justify-between p-12">
        <div>
          <span className="text-[#D97757] text-6xl font-bold tracking-tight border-b-8 border-white ">
            MSCAN
          </span>
        </div>
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-white text-4xl font-semibold leading-tight">
              Recover your account.
              <br />
              We will help you get back in.
            </h2>
            <p className="text-white mt-4 text-base leading-relaxed">
              Choose how you want to recover your password, get the code in your
              inbox, and set a new password right away.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { icon: User, text: "Use username if you remember it" },
              { icon: Mail, text: "Or recover with your email address" },
              { icon: ShieldCheck, text: "Reset access with a secure code" },
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Password recovery for{" "}
              <span className="text-3xl font-bold tracking-tight text-[#D97757]">
                MSCAN
              </span>
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Pick the option you remember, receive a code by email, then set a
              new password.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => switchRecoveryMode("username")}
              className={cn(
                "rounded-2xl border px-4 py-3 text-left transition-all",
                recoveryMode === "username"
                  ? "border-[#D97757] bg-[#FFF5F1]"
                  : "border-gray-200 bg-white hover:border-gray-300",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border",
                    recoveryMode === "username"
                      ? "border-[#D97757] bg-[#D97757] text-white"
                      : "border-gray-300",
                  )}
                >
                  {recoveryMode === "username" && <Check className="h-3 w-3" />}
                </span>
                <span className="text-sm font-medium">Username</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                I remember my username.
              </p>
            </button>

            <button
              type="button"
              onClick={() => switchRecoveryMode("email")}
              className={cn(
                "rounded-2xl border px-4 py-3 text-left transition-all",
                recoveryMode === "email"
                  ? "border-[#D97757] bg-[#FFF5F1]"
                  : "border-gray-200 bg-white hover:border-gray-300",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border",
                    recoveryMode === "email"
                      ? "border-[#D97757] bg-[#D97757] text-white"
                      : "border-gray-300",
                  )}
                >
                  {recoveryMode === "email" && <Check className="h-3 w-3" />}
                </span>
                <span className="text-sm font-medium">Email</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                I remember my email address.
              </p>
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
            {isRecoveryCodeSent ? (
              <Form {...resetForm}>
                <form
                  onSubmit={resetForm.handleSubmit(onResetPassword)}
                  className="flex flex-col gap-4"
                >
                  <div className="rounded-xl bg-[#FFF5F1] border border-[#F5C6B6] px-4 py-3 text-sm text-gray-700">
                    Code sent to{" "}
                    {recoveryMode === "email"
                      ? submittedIdentifier
                      : "the email linked to your username"}
                    .
                  </div>

                  <FormField
                    name="verificationCode"
                    control={resetForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Verification code
                        </FormLabel>
                        <FormControl>
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <InputOTPGroup className="flex gap-2 justify-center">
                              {otpSlots.map((slot) => (
                                <InputOTPSlot
                                  key={slot}
                                  index={slot - 1}
                                  className="h-12 w-12 text-lg border border-gray-300 rounded-lg focus:border-black focus:ring-0"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="newPassword"
                    control={resetForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          New password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              className="h-11 border focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none pr-10"
                              placeholder="new password..."
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword((value) => !value)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="confirmPassword"
                    control={resetForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Confirm password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              className="h-11 border focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none pr-10"
                              placeholder="confirm password..."
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword((value) => !value)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isResettingPassword}
                    className="w-full h-11 rounded-full bg-[#D97757] hover:bg-gray-900 cursor-pointer text-white font-medium"
                  >
                    {isResettingPassword ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Update password"
                    )}
                  </Button>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <button
                      type="button"
                      onClick={resetFlow}
                      className="underline underline-offset-2 hover:text-black"
                    >
                      Use another account
                    </button>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isRequestingCode}
                      className="underline underline-offset-2 hover:text-black"
                    >
                      Resend code
                    </button>
                  </div>
                </form>
              </Form>
            ) : (
              <Form {...requestForm}>
                <form
                  onSubmit={requestForm.handleSubmit(onRequestCode)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    name="identifier"
                    control={requestForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Enter your {titleText}
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-11 border focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                            placeholder={inputPlaceholder}
                            type={recoveryMode === "email" ? "email" : "text"}
                            {...field}
                            onChange={(event) => {
                              field.onChange(event);
                              setRequestStatus({ success: "", error: "" });
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isRequestingCode}
                    className="w-full h-11 rounded-full bg-[#D97757] hover:bg-gray-900 cursor-pointer text-white font-medium"
                  >
                    {isRequestingCode ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Send recovery code"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => navigateTo(AUTH)}
              className="font-medium text-[#D97757] underline underline-offset-2 hover:text-gray-900"
            >
              Back to login
            </button>
          </p>
        </div>
      </div>
    </Box>
  );
};

export { ForgotPassword };
