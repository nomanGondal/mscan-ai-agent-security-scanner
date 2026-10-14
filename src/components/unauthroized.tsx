"use client"

import React from "react"
import { Box, Heading, Text } from "@radix-ui/themes"
import { Button } from "@/components/ui/button"

import { RefreshCw } from "lucide-react"

const UnauthorizedPage = () => {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <Box className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md w-full">
        <Heading className="text-3xl mb-4 font-bold">Access Denied</Heading>
        <Text className="mb-6 text-gray-700">
          This page is dedicated for admin use only. You do not have permission
          to access this content.
        </Text>
        <Button
          variant="outline"
          size="lg"
          onClick={handleRefresh}
          className="flex items-center justify-center gap-2 mx-auto mt-8"
        >
          <RefreshCw size={20} /> Refresh Page
        </Button>
      </Box>
    </Box>
  )
}

export { UnauthorizedPage }
