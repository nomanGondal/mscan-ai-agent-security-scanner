"use client"

import React from "react"
import { SearchIcon } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

function NoDataUser() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No User Found</EmptyTitle>
        <EmptyDescription>
          There is no user data available at the moment.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>
          Try refreshing the page or contact support.
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}

export { NoDataUser }
