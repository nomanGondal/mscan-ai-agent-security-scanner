"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

const NotFoundComp = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <Card className="rounded-3xl  border border-gray-200 bg-white">
          <CardContent className="p-10 text-center">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-7xl font-extrabold tracking-tight text-gray-900"
            >
              404
            </motion.h1>
            <p className="mt-4 text-lg font-medium text-gray-700">
              Page not found
            </p>
            <p className="mt-2 text-sm text-gray-500">
              The page you’re looking for doesn’t exist or has been moved.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="default"
                className="rounded-full px-6"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Home
              </Button>

              <Button
                variant="outline"
                className="rounded-full px-6"
                onClick={() => router.refresh()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export { NotFoundComp }
