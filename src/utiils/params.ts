"use client"

import { useSearchParams } from "next/navigation"

interface QUERYPARAMSPROPS {
  key: string
  defaultValue: string
}

const QueryParams = ({ key, defaultValue = "" }: QUERYPARAMSPROPS) => {
  const searchParams = useSearchParams()
  const value = searchParams.get(key)
  return value ?? defaultValue
}

export { QueryParams }
