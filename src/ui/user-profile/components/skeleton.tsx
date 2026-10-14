"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonUserDetails() {
  return (
    <div className="flex items-start space-x-6 p-4">
      <Skeleton className="h-40 w-40 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-3 py-2">
        <Skeleton className="h-6 w-3/4 bg-gray-200" />
        <Skeleton className="h-6 w-1/2 bg-gray-200" />
        <Skeleton className="h-6 w-1/4 bg-gray-200" />
        <Skeleton className="h-6 w-2/3 bg-gray-200" />
        <Skeleton className="h-6 w-1/2 bg-gray-200" />
      </div>
    </div>
  )
}
