"use client"

import { usePasswordUpdation } from "@/hooks"
import { SecurityView } from "@/views"
import React from "react"

const Security = () => {
  const { UpdatingPasswordResponse, isUpdatingPassword, updatePassword } =
    usePasswordUpdation()
  return <SecurityView UpdatingPasswordResponse={UpdatingPasswordResponse} isUpdatingPassword={isUpdatingPassword}  updatePassword={updatePassword}/>
}

export { Security }
