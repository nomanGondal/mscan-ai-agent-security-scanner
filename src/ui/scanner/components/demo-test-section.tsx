"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Loader2,
  Edit2,
  UploadCloud,
  RefreshCw,
  Zap,
  ChevronRight,
  Shield,
  X,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import ScannerService, { ScanResult } from "@/services/scanner";
import { cn } from "@/utiils";
import ScannerPerformanceMatrix from "./scanner-performance-matrix";
import { ScanResultsDisplay } from "./scan-results-display-new";

interface DemoTestSectionProps {
  onResultsReady: (results: ScanResult) => void;
}

const DEMO_FILENAME = "demo_vulnerable_mcp.py";

const DEMO_VULNERABLE_CODE = `from mcp.server.fastmcp import FastMCP
import subprocess
import pickle

mcp = FastMCP("Demo")

@mcp.tool()
def parse_resume(user_input: str):
    result = eval(user_input)
    subprocess.run(f"echo {user_input}", shell=True)
    cached = pickle.loads(user_input.encode())
    return result, cached`;

const PRESET_PROMPTS = [
  {
    label: "eval() injection",
    tag: "RCE",
    prompt: `Generate a vulnerable FastMCP server in Python with exactly this structure:
- Import FastMCP from mcp.server.fastmcp
- Create mcp = FastMCP("VulnerableServer")
- Create a tool named 'process_input' decorated with @mcp.tool()
- The tool accepts user_input: str parameter
- Inside the tool: use eval(user_input) to execute arbitrary code
- Also store result in a variable and return it
- Add inline comments explaining what each line does
- The code must be 20-30 lines long
- Return ONLY raw Python code, no markdown, no explanation outside code comments`,
  },
  {
    label: "pickle deserialization",
    tag: "RCE",
    prompt: `Generate a vulnerable FastMCP server in Python with exactly this structure:
- Import FastMCP, pickle, base64
- Create mcp = FastMCP("CacheServer")
- Create a tool named 'load_cache' decorated with @mcp.tool()
- The tool accepts cache_data: str parameter
- Inside: decode base64, then call pickle.loads() on untrusted data
- Add a second tool named 'store_cache' that serializes data with pickle.dumps
- Add inline comments explaining the vulnerability
- The code must be 20-30 lines long
- Return ONLY raw Python code, no markdown, no explanation outside code comments`,
  },
  {
    label: "command injection",
    tag: "HIGH",
    prompt: `Generate a vulnerable FastMCP server in Python with exactly this structure:
- Import FastMCP, subprocess, os
- Create mcp = FastMCP("ScriptRunner")
- Create a tool named 'run_script' decorated with @mcp.tool()
- The tool accepts script_name: str and resume_data: str parameters
- Inside: use subprocess.run(f"python scripts/{script_name} '{resume_data}'", shell=True)
- Capture stdout and stderr, return the output
- Add inline comments explaining the command injection risk
- The code must be 20-30 lines long
- Return ONLY raw Python code, no markdown, no explanation outside code comments`,
  },
  {
    label: "hardcoded secrets",
    tag: "HIGH",
    prompt: `Generate a vulnerable FastMCP server in Python with exactly this structure:
- Import FastMCP, requests
- Add these hardcoded credentials at the top: API_KEY = "sk-abc123secretkey99999", SECRET_TOKEN = "Bearer eyJhbGciOiJIUzI1NiJ9.secret", DATABASE_URL = "postgresql://admin:password123@localhost/prod_db", WEBHOOK_SECRET = "whsec_abc123xyz789"
- Create mcp = FastMCP("ResumeAPI")
- Create a tool named 'fetch_candidate' that uses API_KEY in Authorization header with requests.get
- Create a tool named 'push_result' that uses SECRET_TOKEN for a webhook POST
- Add inline comments noting the hardcoded secret risk
- The code must be 25-35 lines long
- Return ONLY raw Python code, no markdown, no explanation outside code comments`,
  },
  {
    label: "yaml.load unsafe",
    tag: "RCE",
    prompt: `Generate a vulnerable FastMCP server in Python with exactly this structure:
- Import FastMCP, yaml, json
- Create mcp = FastMCP("ConfigParser")
- Create a tool named 'parse_config' decorated with @mcp.tool()
- The tool accepts yaml_content: str parameter
- Inside: call yaml.load(yaml_content, Loader=yaml.Loader) — NOT yaml.safe_load
- Parse the result and return specific fields like name, version, settings
- Add a second tool named 'parse_json_config' that does json.loads on user input
- Add inline comments explaining why yaml.Loader is dangerous vs yaml.SafeLoader
- The code must be 25-30 lines long
- Return ONLY raw Python code, no markdown, no explanation outside code comments`,
  },
  {
    label: "SSRF via requests",
    tag: "MED",
    prompt: `Generate a vulnerable FastMCP server in Python with exactly this structure:
- Import FastMCP, requests
- Create mcp = FastMCP("ResumeFetcher")
- Create a tool named 'fetch_resume' decorated with @mcp.tool()
- The tool accepts url: str parameter with no validation
- Inside: directly call requests.get(url, timeout=10) and return response.text
- Create a second tool named 'post_resume' that does requests.post(url, json=data) with user-controlled url and data
- Add inline comments explaining the SSRF risk
- The code must be 25-30 lines long
- Return ONLY raw Python code, no markdown, no explanation outside code comments`,
  },
  {
    label: "filesystem traversal",
    tag: "MED",
    prompt: `Generate a vulnerable FastMCP server in Python with exactly this structure:
- Import FastMCP, os, glob
- Create mcp = FastMCP("FileManager")
- Create a tool named 'list_files' decorated with @mcp.tool()
- The tool accepts directory: str parameter
- Inside: use os.listdir(directory), glob.glob(f"{directory}/**/*.pdf", recursive=True), and os.walk(directory)
- Collect all results and return them
- Create a second tool named 'read_file' that opens and reads a file at a user-supplied path
- Add inline comments explaining the path traversal risk
- The code must be 25-30 lines long
- Return ONLY raw Python code, no markdown, no explanation outside code comments`,
  },
  {
    label: "multi-vuln tool",
    tag: "CRIT",
    prompt: `Generate a vulnerable FastMCP server in Python with exactly this structure:
- Import FastMCP, subprocess, pickle, yaml, requests, os
- Add hardcoded: API_KEY = "sk-prod-abc123xyz789secretkey"
- Create mcp = FastMCP("VulnerableParser")
- Create a tool named 'vulnerable_parser' decorated with @mcp.tool()
- The tool accepts user_input: str and config: str parameters
- Inside the tool in order:
  1. Call eval(user_input) and store result
  2. Call subprocess.run(f"parse {user_input}", shell=True)
  3. Call pickle.loads(user_input.encode())
  4. Call yaml.load(config, Loader=yaml.Loader)
  5. Call requests.get(user_input) with no validation
- Return all results as a dict
- Add inline comments for each vulnerability explaining the risk
- The code must be 35-45 lines long
- Return ONLY raw Python code, no markdown, no explanation outside code comments`,
  },
];

const TAG_COLORS: Record<string, string> = {
  RCE: "bg-red-50 text-red-600 border-red-200",
  HIGH: "bg-orange-50 text-orange-600 border-orange-200",
  MED: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CRIT: "bg-red-100 text-red-700 border-red-300",
};

export const DemoTestSection: React.FC<DemoTestSectionProps> = ({
  onResultsReady,
}) => {
  const [isScanning, setIsScanning] = React.useState(false);
  const [code, setCode] = React.useState<string>(DEMO_VULNERABLE_CODE);
  const [isEditable, setIsEditable] = React.useState<boolean>(false);
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [showAIPanel, setShowAIPanel] = React.useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = React.useState<string>("");
  const [selectedPresets, setSelectedPresets] = React.useState<number[]>([]);

  // ── NEW: track scan result + the code that was scanned ──
  const [scanResult, setScanResult] = React.useState<ScanResult | null>(null);
  const [scannedCode, setScannedCode] = React.useState<string>("");

  const handleRunDemo = async () => {
    if (isScanning) return;
    setIsScanning(true);
    // Clear previous matrix while new scan runs
    setScanResult(null);
    setScannedCode("");
    try {
      const result = await ScannerService.scanModel({
        filename: DEMO_FILENAME,
        code,
      });
      if (result) {
        onResultsReady(result);
        // Capture snapshot of the code that was scanned
        setScanResult(result);
        setScannedCode(code);
        toast.success("Demo scan completed!");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Demo scan failed";
      toast.error(message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleRestoreDefault = () => {
    setCode(DEMO_VULNERABLE_CODE);
    setIsEditable(false);
    setShowAIPanel(false);
    setSelectedPresets([]);
    setAiPrompt("");
    setScanResult(null);
    setScannedCode("");
  };

  const handleFileUpload = async (file?: File) => {
    if (!file) return;
    const txt = await file.text();
    setCode(txt);
    setIsEditable(true);
    setScanResult(null);
    setScannedCode("");
  };

  const handleTogglePreset = (index: number) => {
    setSelectedPresets((prev) => {
      const isSelected = prev.includes(index);
      const next = isSelected
        ? prev.filter((i) => i !== index)
        : [...prev, index];

      if (next.length === 0) {
        setAiPrompt("");
      } else if (next.length === 1) {
        setAiPrompt(PRESET_PROMPTS[next[0]].prompt);
      } else {
        const names = next.map((i) => PRESET_PROMPTS[i].label).join(", ");
        const combined = `Generate a single vulnerable FastMCP server in Python that combines ALL of the following vulnerability types. Each vulnerability must be in its own separate @mcp.tool() decorated function. Use proper FastMCP structure throughout. The total code must be 50-70 lines long. Return ONLY raw Python code, no markdown, no explanation outside inline comments.\n\nVulnerabilities to include: ${names}.\n\nFor each vulnerability:\n${next.map((i, n) => `${n + 1}. ${PRESET_PROMPTS[i].label}: ${PRESET_PROMPTS[i].prompt.split("\n")[1] ?? ""}`).join("\n")}`;
        setAiPrompt(combined);
      }
      return next;
    });
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please select a preset or enter a prompt first.");
      return;
    }
    setIsGenerating(true);
    try {
      const resp = await fetch("/api/generate_vulnerable_code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      if (!resp.ok) {
        const err = await resp.text();
        throw new Error(err || "AI generation failed");
      }
      const data = await resp.json();
      if (data?.code) {
        setCode(data.code);
        setIsEditable(true);
        setShowAIPanel(false);
        setScanResult(null);
        setScannedCode("");
        toast.success(
          selectedPresets.length > 1
            ? `Generated with ${selectedPresets.length} combined vulnerabilities!`
            : "Code generated successfully!",
        );
      } else {
        throw new Error("No code returned from AI");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Generation failed";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-4"
    >
      <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D97757] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 tracking-tight">
                MCP Demo Scanner
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Scan vulnerable FastMCP code samples in real time
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#D97757] border border-[#D97757]/30 bg-[#D97757]/5 px-3 py-1.5 rounded-full">
            Live
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 cursor-pointer hover:border-[#D97757] hover:text-[#D97757] transition-all">
              <input
                type="file"
                accept="*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />
              <UploadCloud className="w-4 h-4" />
              Upload file
            </label>

            <button
              onClick={() => setIsEditable((s) => !s)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all",
                isEditable
                  ? "border-[#D97757] text-[#D97757] bg-[#D97757]/5"
                  : "border-gray-200 text-gray-600 hover:border-[#D97757] hover:text-[#D97757]",
              )}
            >
              <Edit2 className="w-4 h-4" />
              {isEditable ? "Close editor" : "Edit code"}
            </button>

            <button
              onClick={handleRestoreDefault}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-[#D97757] hover:text-[#D97757] transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Restore default
            </button>

            <button
              onClick={() => setShowAIPanel((v) => !v)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all ml-auto",
                showAIPanel
                  ? "bg-purple-700 border-purple-700 text-white"
                  : "bg-purple-600 border-purple-600 text-white hover:bg-purple-700 hover:border-purple-700",
              )}
            >
              {showAIPanel ? (
                <>
                  <X className="w-4 h-4" /> Close AI panel
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Generate with AI
                </>
              )}
            </button>
          </div>

          {/* AI Generation Panel */}
          <AnimatePresence>
            {showAIPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="border border-purple-100 rounded-xl bg-purple-50/50 p-5 space-y-4">
                  {/* Preset chips */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                        MCP vulnerability presets
                      </p>
                      {selectedPresets.length > 0 && (
                        <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
                          {selectedPresets.length} selected — will be combined
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_PROMPTS.map((preset, i) => {
                        const isSelected = selectedPresets.includes(i);
                        return (
                          <button
                            key={i}
                            onClick={() => handleTogglePreset(i)}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all",
                              isSelected
                                ? "border-purple-600 bg-purple-600 text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:border-purple-400 hover:text-purple-600",
                            )}
                          >
                            {isSelected ? (
                              <Check className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                              <span
                                className={cn(
                                  "text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0",
                                  TAG_COLORS[preset.tag],
                                )}
                              >
                                {preset.tag}
                              </span>
                            )}
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2.5">
                      Select multiple presets — AI will combine them into one
                      FastMCP server with separate tools per vulnerability.
                    </p>
                  </div>

                  {/* Prompt textarea */}
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                      Prompt
                    </p>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => {
                        setAiPrompt(e.target.value);
                        setSelectedPresets([]);
                      }}
                      placeholder="Or write a custom prompt... e.g. Generate a FastMCP tool with eval() and hardcoded API key"
                      rows={4}
                      className="w-full text-xs font-mono text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-3 resize-none outline-none focus:border-purple-400 transition-colors placeholder:text-gray-300 leading-relaxed"
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5">
                      Prompts are pre-tuned to generate 20–60 line
                      FastMCP-compatible vulnerable code only.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateWithAI}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
                      isGenerating || !aiPrompt.trim()
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700",
                    )}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Generating
                        code...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> Generate MCP code{" "}
                        <ChevronRight className="w-4 h-4 ml-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Code viewer */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-[11px] text-gray-400 font-mono">
                  {DEMO_FILENAME}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">
                Python · FastMCP
              </span>
            </div>

            {isEditable ? (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full min-h-[260px] bg-gray-950 text-gray-100 px-5 py-4 text-xs leading-6 font-mono outline-none resize-none"
              />
            ) : (
              <pre className="w-full min-h-[260px] bg-gray-950 text-gray-100 px-5 py-4 text-xs leading-6 font-mono overflow-x-auto">
                {code}
              </pre>
            )}
          </div>

          {/* Run button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleRunDemo}
            disabled={isScanning}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold tracking-wide transition-all",
              isScanning
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#D97757] text-white hover:bg-[#c4684a]",
            )}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Scanning MCP
                tool...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Run security scan
              </>
            )}
          </motion.button>

          {/* Info bar */}
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100">
            <Shield className="w-4 h-4 text-[#D97757] mt-0.5 shrink-0" />
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-700">Note:</span> This
              scanner detects vulnerabilities specific to{" "}
              <span className="font-semibold text-[#D97757]">
                FastMCP tools
              </span>{" "}
              AST patterns, Pyre type issues, and Pysa taint flows. Select
              multiple presets to generate combined vulnerability scenarios.
            </p>
          </div>
        </div>
      </div>

      {/* ── Scan Results Display ── */}
      <AnimatePresence>
        {scanResult && scannedCode && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <ScanResultsDisplay result={scanResult} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Performance Matrix — rendered after each successful scan ── */}
      <AnimatePresence>
        {scanResult && scannedCode && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <ScannerPerformanceMatrix
              scanResult={scanResult}
              scannedCode={scannedCode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
