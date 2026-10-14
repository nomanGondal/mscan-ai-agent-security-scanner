"use client"

import { usePasswordUpdation } from "@/hooks"
import { forgotPasswordSchema } from "@/schemas"
import { AuthStatus } from "@/types"
import { SecurityBoard, SecuritySectionOne } from "@/ui"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box } from "@radix-ui/themes"
import React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface SecurityViewProps {
  UpdatingPasswordResponse: AuthStatus
  isUpdatingPassword: boolean
  updatePassword: (
    data: z.infer<typeof forgotPasswordSchema>
  ) => Promise<any> | void
}
const SecurityView = ({
  UpdatingPasswordResponse,
  isUpdatingPassword,
  updatePassword,
}: SecurityViewProps) => {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      previousPassword: "",
      newPassword: "",
    },
  })

  return (
    <Box>
      <SecuritySectionOne />
      <SecurityBoard
        form={form}
        UpdatingPasswordResponse={UpdatingPasswordResponse}
        isUpdatingPassword={isUpdatingPassword}
        updatePassword={updatePassword}
      />
    </Box>
  )
}

export { SecurityView }
