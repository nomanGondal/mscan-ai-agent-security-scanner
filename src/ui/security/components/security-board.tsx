"use client"

import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AuthStatus } from "@/types"
import { Box } from "@radix-ui/themes"
import React from "react"
import * as z from "zod"
import { forgotPasswordSchema } from "@/schemas"
import { UseFormReturn } from "react-hook-form"
import { UpdatePasswordForm } from "@/views"

interface SecurityBoardProps {
  UpdatingPasswordResponse: AuthStatus
  isUpdatingPassword: boolean
  updatePassword: (
    data: z.infer<typeof forgotPasswordSchema>
  ) => Promise<any> | void
  form: UseFormReturn<z.infer<typeof forgotPasswordSchema>>
}

const SecurityBoard = ({
  UpdatingPasswordResponse,
  isUpdatingPassword,
  updatePassword,
  form,
}: SecurityBoardProps) => {
  return (
    <Box className="w-full p-6 ">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value="item-1"
          className="cursor-pointer border-2 rounded-md p-4 "
        >
          <AccordionTrigger className="cursor-pointer underline-none hover:border-none hover:underline-none text-2xl">
            Update your password
          </AccordionTrigger>
          <AccordionContent>
            <UpdatePasswordForm
              form={form}
              UpdatingPasswordResponse={UpdatingPasswordResponse}
              isUpdatingPassword={isUpdatingPassword}
              updatePassword={updatePassword}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}

export { SecurityBoard }
