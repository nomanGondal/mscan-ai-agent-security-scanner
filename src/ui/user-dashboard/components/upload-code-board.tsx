  "use client"

  import React, { useState, useEffect } from "react"
  import { Label } from "@/components/ui/label"
  import { Box } from "@radix-ui/themes"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { cn } from "@/lib/utils"
  import { GtihubIcon } from "@/components"
  import Image from "next/image"
  import { useRouter } from "next/navigation"
  import { Shield, Server, Zap } from "lucide-react"

  import scanner from "../../../../public/scanner.png"
  import scanner2 from "../../../../public/sc1 (1).png"
  import readingFile from "../../../../public/readingfile.png"
  import completeScan from "../../../../public/comp (1).png"

  interface UploadState {
    mode: "zip" | "github"
  }

  type ScanStage = "idle" | "reading" | "analyzing" | "checking" | "complete"

  const UploadCode = () => {
    const router = useRouter()

    const [uploadState, setUploadState] = useState<UploadState>({ mode: "zip" })
    const [zipFile, setZipFile] = useState<File | null>(null)
    const [githubUrl, setGithubUrl] = useState("")
    const [scanStage, setScanStage] = useState<ScanStage>("idle")

    const uploadType = uploadState.mode
    const isScanDisabled =
      (uploadType === "zip" && !zipFile) ||
      (uploadType === "github" && !githubUrl)

    const handleScan = () => {
      setScanStage("reading")
    }

    useEffect(() => {
      let timeout: NodeJS.Timeout

      if (scanStage === "reading") {
        timeout = setTimeout(() => setScanStage("analyzing"), 3000)
      }
      if (scanStage === "analyzing") {
        timeout = setTimeout(() => setScanStage("checking"), 3000)
      }
      if (scanStage === "checking") {
        timeout = setTimeout(() => setScanStage("complete"), 3000)
      }

      return () => clearTimeout(timeout)
    }, [scanStage])

    const getStageContent = () => {
      switch (scanStage) {
        case "reading":
          return {
            image: readingFile,
            title: "Reading files",
            description:
              "Extracting and indexing your project files for analysis.",
          }
        case "analyzing":
          return {
            image: scanner,
            title: "Analyzing source code",
            description:
              "Scanning code structure, dependencies, and logic patterns.",
          }
        case "checking":
          return {
            image: scanner2,
            title: "Checking vulnerabilities",
            description:
              "Detecting insecure patterns, misconfigurations, and risks.",
          }
        case "complete":
          return {
            image: completeScan,
            title: "Scan complete",
            description: "Analysis finished successfully. Your report is ready.",
          }
        default:
          return null
      }
    }

    const stage = getStageContent()

    return (
      <Box className="w-full flex items-center justify-center py-6 relative">
        <Box className="border w-[720px] rounded-md flex flex-col p-6 gap-6 transition-all duration-500 relative">
          <Box>
            <Label className="text-base font-medium">
              Upload your source code
            </Label>
            <p className="text-sm text-muted-foreground">
              Upload a ZIP file or provide a GitHub repository URL.
            </p>
          </Box>

          <Box className="h-px bg-black w-full" />

          <Box className="flex gap-3">
            <Button
              variant={uploadType === "zip" ? "default" : "outline"}
              onClick={() => setUploadState({ mode: "zip" })}
              className={cn(
                "flex-1",
                uploadType === "zip" && "ring-2 ring-black"
              )}
            >
              Upload ZIP
            </Button>
            <Button
              variant={uploadType === "github" ? "default" : "outline"}
              onClick={() => setUploadState({ mode: "github" })}
              className="flex-1"
            >
              <GtihubIcon />
              GitHub URL
            </Button>
          </Box>

          {uploadType === "zip" && (
            <Box className="flex flex-col gap-2">
              <Label>ZIP file</Label>
              <Input
                type="file"
                accept=".zip"
                onChange={(e) => setZipFile(e.target.files?.[0] ?? null)}
              />
            </Box>
          )}
          {uploadType === "github" && (
            <Box className="flex flex-col gap-2">
              <Label>GitHub Repository URL</Label>
              <Input
                type="url"
                placeholder="https://github.com/username/repository"
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </Box>
          )}

          <Box className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleScan}
              disabled={
                isScanDisabled ||
                scanStage === "reading" ||
                scanStage === "analyzing" ||
                scanStage === "checking"
              }
            >
              {scanStage === "idle" || scanStage === "complete"
                ? "Scan Code"
                : "Scanning..."}
            </Button>
          </Box>

          {stage && (
            <Box className="mt-8 flex flex-col items-center gap-4 relative">
              <Image
                src={stage.image}
                alt={stage.title}
                width={360}
                height={360}
                className={scanStage !== "complete" ? "animate-pulse" : ""}
              />
              <p className="text-sm font-semibold">{stage.title}</p>
              <p className="text-xs text-muted-foreground text-center max-w-md">
                {stage.description}
              </p>

              {scanStage === "complete" && (
                <Button className="mt-4" onClick={() => router.push("/reports")}>
                  View Scan Report
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
    )
  }

  export { UploadCode }
