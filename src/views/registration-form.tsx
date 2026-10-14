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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_PERSONA, VERIFY_CODE } from "@/constants";
import { registrationSchema } from "@/schemas";
import { AuthStatus } from "@/types";
import { showToast } from "@/utiils";
import { useNavigation } from "@/utiils/navigation";
import { Box } from "@radix-ui/themes";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface RegistrationFormProps {
  form: UseFormReturn<z.infer<typeof registrationSchema>>;
  usernameForUserRegistration: string;
  debouncingForUsername: (username: string) => void;
  isRegistrationUnderProgress: boolean;
  registrationProcessResponse: AuthStatus;
  registerUser: (
    data: z.infer<typeof registrationSchema>,
  ) => Promise<any> | void;
  usernameUniquenessCheckingResponse: AuthStatus;
  isCheckingUsernameUniquness: boolean;
}

const RegistrationForm = ({
  form,
  usernameForUserRegistration,
  debouncingForUsername,
  isRegistrationUnderProgress,
  registrationProcessResponse,
  registerUser,
  usernameUniquenessCheckingResponse,
  isCheckingUsernameUniquness,
}: RegistrationFormProps) => {
  const { navigateTo } = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Both watches at top level so React re-renders on every keystroke
  const watchedPassword = form.watch("password");
  const watchedConfirmPassword = form.watch("confirmPassword");
  const isMatch =
    watchedConfirmPassword.length > 0 &&
    watchedConfirmPassword === watchedPassword;
  const isMismatch =
    watchedConfirmPassword.length > 0 &&
    watchedConfirmPassword !== watchedPassword;

  useEffect(() => {
    if (registrationProcessResponse.success) {
      showToast(registrationProcessResponse.success, "success");
      setTimeout(() => {
        navigateTo(`${VERIFY_CODE}?username=${usernameForUserRegistration}`);
      }, 1000);
    }
    if (registrationProcessResponse.error) {
      showToast(registrationProcessResponse.error, "error");
    }
  }, [registrationProcessResponse, navigateTo, usernameForUserRegistration]);

  const onSubmit = async (data: z.infer<typeof registrationSchema>) => {
    try {
      await registerUser(data);
    } catch {
      showToast("Registration failed", "error");
    }
  };

  const personaToLower = (persona: string) =>
    persona
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const inputClass =
    "h-11 border focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Row 1: Username + Email */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Username <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className={inputClass}
                    placeholder="username..."
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debouncingForUsername(e.target.value);
                    }}
                  />
                </FormControl>
                <Box className="min-h-[18px] flex items-center gap-1.5">
                  {field.value?.length > 0 && isCheckingUsernameUniquness && (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                      <Label className="text-xs text-gray-400">
                        checking...
                      </Label>
                    </>
                  )}
                  {field.value?.length > 0 &&
                    !isCheckingUsernameUniquness &&
                    usernameUniquenessCheckingResponse.success && (
                      <Label className="text-xs text-green-600">
                        {usernameUniquenessCheckingResponse.success}
                      </Label>
                    )}
                  {field.value?.length > 0 &&
                    !isCheckingUsernameUniquness &&
                    usernameUniquenessCheckingResponse.error && (
                      <Label className="text-xs text-red-500">
                        {usernameUniquenessCheckingResponse.error}
                      </Label>
                    )}
                </Box>
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Email <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className={inputClass}
                    placeholder="email..."
                    type="email"
                    {...field}
                  />
                </FormControl>
                <div className="min-h-[18px]">
                  <FormMessage className="text-xs" />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Row 2: Full Name + Persona */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="fullName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Full Name <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className={inputClass}
                    placeholder="full name..."
                    {...field}
                  />
                </FormControl>
                <div className="min-h-[18px]">
                  <FormMessage className="text-xs" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            name="persona"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Persona</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="!h-11 border focus-visible:ring-0 focus-visible:ring-offset-0 w-full">
                      <SelectValue placeholder="Who are you?" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(USER_PERSONA).map((persona) => (
                        <SelectItem key={persona} value={persona}>
                          {personaToLower(persona)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <div className="min-h-[18px]">
                  <FormMessage className="text-xs" />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Row 3: Password + Confirm Password */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Password <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className={inputClass}
                      placeholder="password..."
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <div className="min-h-[18px]">
                  <FormMessage className="text-xs" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Confirm Password <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      className={inputClass}
                      placeholder="confirm..."
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
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
                <div className="min-h-[18px]">
                  <FormMessage className="text-xs" />
                  {isMatch && !form.formState.errors.confirmPassword && (
                    <p className="text-xs text-green-600">Passwords match ✓</p>
                  )}
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isRegistrationUnderProgress}
          className="w-full h-11 mt-1 rounded-full bg-[#D97757] cursor-pointer hover:bg-gray-900 text-white font-medium"
        >
          {isRegistrationUnderProgress ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </Form>
  );
};

export { RegistrationForm };
