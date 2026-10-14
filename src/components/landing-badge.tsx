import React from "react"
import { Box } from "@radix-ui/themes"
import { Badge } from "./ui/badge"
import { BadgeCheckIcon } from "./icons/badge-check-icon"
import { GtihubIcon } from "./icons/github"

const LandingBadge = () => {
  return (
    <Box className="flex flex-col gap-2">
      <Box className="flex gap-2">
        <Badge>
          <GtihubIcon />
          Home
        </Badge>
        <Badge variant="secondary">Security</Badge>
        <Badge variant="destructive">Critical</Badge>
        <Badge variant="outline">Beta</Badge>
      </Box>
      <Box className="flex gap-2 ml-[calc(0.25rem)]">
        <Badge
          variant="secondary"
          className="flex items-center gap-1 bg-blue-500 text-white dark:bg-blue-600"
        >
          <BadgeCheckIcon />
          Verified
        </Badge>
        <Badge className="rounded-full text-white bg-gray-700 dark:bg-gray-800">
          8
        </Badge>
      </Box>
    </Box>
  )
}

export { LandingBadge }
