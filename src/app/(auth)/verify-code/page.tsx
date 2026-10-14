"use client"

import { VerificationCode } from "@/ui"
import { Suspense } from "react"

const page = () => {
  return (
    <Suspense fallback={null}>
      <VerificationCode />
    </Suspense>
  )
}

export default page
