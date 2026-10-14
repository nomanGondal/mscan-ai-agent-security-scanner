"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPasswordSchema } from "@/schemas"
import { AuthStatus } from "@/types"
import { showToast } from "@/utiils"
import { Box } from "@radix-ui/themes"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import React, { useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import * as z from "zod"

interface UpdatePasswordFormProps {
  form: UseFormReturn<z.infer<typeof forgotPasswordSchema>>
  UpdatingPasswordResponse: AuthStatus
  isUpdatingPassword: boolean
  updatePassword: (
    data: z.infer<typeof forgotPasswordSchema>
  ) => Promise<any> | void
}

const UpdatePasswordForm = ({
  form,
  UpdatingPasswordResponse,
  isUpdatingPassword,
  updatePassword,
}: UpdatePasswordFormProps) => {
  const [showPreviousPassword, setShowPreviousPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
      await updatePassword(data)
    } catch (error) {
      showToast("Cannot update password", "error")
    }
  }
  useEffect(() => {
    if (UpdatingPasswordResponse.success) {
      const successMessage = UpdatingPasswordResponse.success
      showToast(successMessage, "success")
    }
    if (UpdatingPasswordResponse.error) {
      const errorMessage = UpdatingPasswordResponse.error
      showToast(errorMessage, "error")
    }
  }, [UpdatingPasswordResponse])
  return (
    <Box>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="previousPassword"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Previous Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPreviousPassword ? "text" : "password"}
                        placeholder="please enter previous password...."
                        className="pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute right-1 top-1 h-7 w-7"
                        onClick={() => setShowPreviousPassword((prev) => !prev)}
                        aria-label={showPreviousPassword ? "Hide previous password" : "Show previous password"}
                      >
                        {showPreviousPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )
            }}
          />
          <FormField
            name="newPassword"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem className="mt-5">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="please enter new password...."
                        className="pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute right-1 top-1 h-7 w-7"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )
            }}
          />
          <Button type="submit" className="mt-4 cursor-pointer">
            {isUpdatingPassword ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Label className="cursor-pointer">Change password</Label>
            )}
          </Button>
        </form>
      </Form>
    </Box>
  )
}

export { UpdatePasswordForm }
