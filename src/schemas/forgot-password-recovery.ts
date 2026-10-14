import { z } from "zod";

const recoveryModeGuard = z.enum(["username", "email"]);

const recoveryIdentifierGuard = z
  .string()
  .trim()
  .min(1, { message: "Please enter your username or email." });

const recoveryCodeGuard = z
  .string()
  .trim()
  .length(6, { message: "Verification code must be 6 digits." });

const recoveryPasswordGuard = z
  .string()
  .trim()
  .min(6, { message: "Password must be at least 6 characters long." });

const forgotPasswordRecoveryRequestSchema = z
  .object({
    recoveryMode: recoveryModeGuard,
    identifier: recoveryIdentifierGuard,
  })
  .superRefine((value, ctx) => {
    if (value.recoveryMode === "email") {
      const emailResult = z.email().safeParse(value.identifier);
      if (!emailResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["identifier"],
          message: "Please enter a valid email address.",
        });
      }
    }

    if (
      value.recoveryMode === "username" &&
      value.identifier.trim().length < 3
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["identifier"],
        message: "Username must be at least 3 characters long.",
      });
    }
  });

const forgotPasswordRecoveryResetSchema = z
  .object({
    recoveryMode: recoveryModeGuard,
    identifier: recoveryIdentifierGuard,
    verificationCode: recoveryCodeGuard,
    newPassword: recoveryPasswordGuard,
    confirmPassword: recoveryPasswordGuard,
  })
  .superRefine((value, ctx) => {
    if (value.recoveryMode === "email") {
      const emailResult = z.email().safeParse(value.identifier);
      if (!emailResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["identifier"],
          message: "Please enter a valid email address.",
        });
      }
    }

    if (
      value.recoveryMode === "username" &&
      value.identifier.trim().length < 3
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["identifier"],
        message: "Username must be at least 3 characters long.",
      });
    }

    if (value.newPassword !== value.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export {
  forgotPasswordRecoveryRequestSchema,
  forgotPasswordRecoveryResetSchema,
};
