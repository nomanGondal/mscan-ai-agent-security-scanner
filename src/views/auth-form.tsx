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
import { signInSchema } from "@/schemas";
import { AuthStatus } from "@/types";
import { showToast } from "@/utiils";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import z from "zod";

interface AuthFormProps {
  form: UseFormReturn<z.infer<typeof signInSchema>>;
  isSigningIn: boolean;
  signingUserResponse: AuthStatus;
  signningInUser: (data: z.infer<typeof signInSchema>) => Promise<any> | void;
}

const AuthForm = ({
  form,
  isSigningIn,
  signingUserResponse,
  signningInUser,
}: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      await signningInUser(data);
    } catch {
      showToast("Auth Failed", "error");
    }
  };

  useEffect(() => {
    if (signingUserResponse.success)
      showToast(signingUserResponse.success, "success");
    if (signingUserResponse.error)
      showToast(signingUserResponse.error, "error");
  }, [signingUserResponse]);

  const inputClass =
    "h-11 border focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          name="identifier"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Email or Username
              </FormLabel>
              <FormControl>
                <Input
                  className={inputClass}
                  placeholder="email or username..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium">Password</FormLabel>
                <a
                  href="/forgot-password"
                  className="text-xs text-gray-500
                  hover:text-black underline underline-offset-2
                  transition-colors"
                >
                  {" "}
                  Forgot password?
                </a>
              </div>
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
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSigningIn}
          className="w-full h-11 mt-1 rounded-full bg-[#D97757] hover:bg-gray-900 cursor-pointer text-white font-medium"
        >
          {isSigningIn ? <Loader2 className="animate-spin" /> : "Sign in"}
        </Button>
      </form>
    </Form>
  );
};

export { AuthForm };
