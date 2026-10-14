"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Upload,
  CheckCircle2,
  Activity,
  Loader2,
  Github,
  Lock,
  FolderTree,
  RefreshCcw,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/utiils";
import JSZip from "jszip";
import ScannerService, { ScanResult, Vulnerability } from "@/services/scanner";
import { API_ENDPOINTS } from "@/actions";
import { toast } from "react-toastify";
import { DemoTestSection } from "./components/demo-test-section";

type FindingListItemProps = {
  item: Vulnerability;
  index: number;
};

const FindingListItem: React.FC<FindingListItemProps> = ({ item, index }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="rounded-lg border border-black bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-black">
            {index + 1}. {item.title}
          </p>
          <p className="mt-1 text-xs text-gray-700">{item.description}</p>
          <p className="mt-1 text-xs text-gray-500">
            Severity: {item.severity.toUpperCase()} | {item.file || "unknown"}
            {item.line ? `:${item.line}` : ""}
          </p>
        </div>

        <button
          onClick={() => setShowDetails((previous) => !previous)}
          className="shrink-0 rounded border border-black px-2 py-1 text-xs font-medium text-black hover:bg-black hover:text-white transition"
        >
          {showDetails ? "Hide Detail" : "Detail"}
        </button>
      </div>

      {showDetails ? (
        <div className="mt-3 space-y-2 border-t border-gray-300 pt-3 text-xs text-gray-700">
          {item.analysisStage ? <p>Stage: {item.analysisStage}</p> : null}
          {item.recommendation ? (
            <p>Recommendation: {item.recommendation}</p>
          ) : null}
          {item.code_snippet ? (
            <pre className="overflow-x-auto rounded border border-gray-300 bg-gray-50 p-2 text-[11px] leading-5 text-black">
              {item.code_snippet}
            </pre>
          ) : null}
          {item.cwe || item.owasp ? (
            <p>
              {item.cwe ? `CWE: ${item.cwe}` : ""}
              {item.cwe && item.owasp ? " | " : ""}
              {item.owasp ? `OWASP: ${item.owasp}` : ""}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

type DashboardMetrics = {
  totalScans: number;
  avgIssuesPerScan: number;
  criticalIssues: number;
  scansRemaining: number | null;
  planName: string;
  reportsUsed: number;
  reportsLimit: number;
  isUnlimited: boolean;
  upgradeRequired: boolean;
  githubEnabled?: boolean;
};

type HealthPoint = {
  at: number;
  healthy: boolean;
};

type ScanTab = "scan" | "demo" | "github";

type TreeNode = {
  id: string;
  name: string;
  depth: number;
  isDir: boolean;
};

type TimelineStep = {
  id: string;
  label: string;
  state: "queued" | "scanning" | "done";
};

const MAX_HEALTH_POINTS = 20;
const MAX_SCAN_TIME_POINTS = 52;
const SCAN_PIPE_STAGES: Array<{
  key: "mcp_ast" | "pyre_typing" | "pysa_taint";
  title: string;
  detail: string;
}> = [
  {
    key: "mcp_ast",
    title: "AST",
    detail: "Checking AST tree problems",
  },
  {
    key: "pyre_typing",
    title: "Pyre",
    detail: "Checking Pyre type issues",
  },
  {
    key: "pysa_taint",
    title: "Pysa",
    detail: "Checking Pysa taint flow",
  },
];

const TABS: Array<{
  key: ScanTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: "scan", label: "Scan", icon: Upload },
  { key: "demo", label: "Demo", icon: Shield },
  { key: "github", label: "Github", icon: Github },
];

function getSeverityCounts(vulnerabilities: Vulnerability[]) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const item of vulnerabilities) {
    if (item.severity === "critical") counts.critical += 1;
    if (item.severity === "high") counts.high += 1;
    if (item.severity === "medium") counts.medium += 1;
    if (item.severity === "low") counts.low += 1;
  }
  return counts;
}

function formatStageTitle(
  stage: "mcp_ast" | "pyre_typing" | "pysa_taint" | "unknown",
) {
  if (stage === "mcp_ast") return "AST";
  if (stage === "pyre_typing") return "Pyre";
  if (stage === "pysa_taint") return "Pysa";
  return "Unknown";
}

function getStageDescription(
  stage: "mcp_ast" | "pyre_typing" | "pysa_taint" | "unknown",
) {
  if (stage === "mcp_ast") return "Structure, sinks, and unsafe AST patterns.";
  if (stage === "pyre_typing")
    return "Type analysis and static correctness checks.";
  if (stage === "pysa_taint") return "Taint flow and source-to-sink tracking.";
  return "Findings that could not be mapped to a stage.";
}

function fileTreeFromZipEntries(entries: string[]): TreeNode[] {
  const sorted = [...entries].sort((a, b) => a.localeCompare(b));
  return sorted.map((entry, index) => {
    const isDir = entry.endsWith("/");
    const clean = entry.replace(/\/$/, "");
    const parts = clean.split("/");
    return {
      id: `${clean}-${index}`,
      name: parts[parts.length - 1] || clean,
      depth: Math.max(0, parts.length - 1),
      isDir,
    };
  });
}

function buildHealthPolyline(points: HealthPoint[]) {
  if (!points.length) return "";
  if (points.length === 1) return "0,30";

  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = point.healthy ? 24 : 78;
      return `${x},${y}`;
    })
    .join(" ");
}

function buildScanEcgY(previous: number, tick: number) {
  const randomDelta = (Math.random() - 0.5) * 20;
  const pulse = tick % 17 === 0 ? -26 : tick % 17 === 1 ? 22 : 0;
  const next = previous + randomDelta + pulse;
  return Math.max(18, Math.min(84, next));
}

function buildEcgPolyline(points: number[]) {
  if (!points.length) return "";
  if (points.length === 1) return `0,${points[0]}`;

  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      return `${x},${point}`;
    })
    .join(" ");
}

function formatElapsedMs(elapsedMs: number) {
  if (elapsedMs <= 0) return "0.0s";
  return `${(elapsedMs / 1000).toFixed(1)}s`;
}

export const ScannerDashboard = () => {
  const [activeTab, setActiveTab] = useState<ScanTab>("scan");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zipTreeNodes, setZipTreeNodes] = useState<TreeNode[]>([]);
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [isScannerHealthy, setIsScannerHealthy] = useState(false);
  const [healthPoints, setHealthPoints] = useState<HealthPoint[]>([]);
  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>([]);
  const [dashboardMetrics, setDashboardMetrics] =
    useState<DashboardMetrics | null>(null);
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [showGithubUpgradePopup, setShowGithubUpgradePopup] = useState(false);
  const [scanPipelineProgress, setScanPipelineProgress] = useState(0);
  const [scanPipelineStep, setScanPipelineStep] = useState(0);
  const [scanStartedAt, setScanStartedAt] = useState<number | null>(null);
  const [scanElapsedMs, setScanElapsedMs] = useState(0);
  const [scanEcgPoints, setScanEcgPoints] = useState<number[]>([]);
  const [, setScanEcgTick] = useState(0);
  const [filteredVulnerabilities, setFilteredVulnerabilities] = useState<
    Vulnerability[]
  >([]);

  const canUseGithub =
    dashboardMetrics?.githubEnabled ??
    (dashboardMetrics ? dashboardMetrics.planName !== "free" : false);

  const severityCounts = useMemo(
    () => getSeverityCounts(scanResults?.vulnerabilities ?? []),
    [scanResults],
  );

  const stageGroupedFindings = useMemo(() => {
    const grouped: Record<
      "mcp_ast" | "pyre_typing" | "pysa_taint" | "unknown",
      Vulnerability[]
    > = {
      mcp_ast: [],
      pyre_typing: [],
      pysa_taint: [],
      unknown: [],
    };

    for (const issue of scanResults?.vulnerabilities ?? []) {
      const stage = issue.analysisStage ?? "unknown";
      grouped[stage].push(issue);
    }

    return grouped;
  }, [scanResults]);

  const fileGroupedFindings = useMemo(() => {
    const grouped = new Map<string, Vulnerability[]>();
    for (const issue of scanResults?.vulnerabilities ?? []) {
      const key = issue.file || "Unmapped findings";
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)?.push(issue);
    }

    return Array.from(grouped.entries())
      .map(([fileName, findings]) => ({ fileName, findings }))
      .sort((a, b) => b.findings.length - a.findings.length);
  }, [scanResults]);

  const totalIssues =
    severityCounts.critical +
    severityCounts.high +
    severityCounts.medium +
    severityCounts.low;

  const healthPolyline = useMemo(
    () => buildHealthPolyline(healthPoints),
    [healthPoints],
  );
  const scanEcgPolyline = useMemo(
    () => buildEcgPolyline(scanEcgPoints),
    [scanEcgPoints],
  );
  const scanEcgTip = useMemo(() => {
    if (!scanEcgPoints.length) return null;
    if (scanEcgPoints.length === 1) {
      return { x: 0, y: scanEcgPoints[0] };
    }
    return {
      x: 100,
      y: scanEcgPoints[scanEcgPoints.length - 1],
    };
  }, [scanEcgPoints]);

  const refreshDashboardMetrics = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard", {
        cache: "no-store",
      });
      if (!response.ok) return;
      const payload = (await response.json()) as {
        data?: { metrics?: DashboardMetrics };
      };
      if (payload?.data?.metrics) {
        setDashboardMetrics(payload.data.metrics);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard metrics:", error);
    }
  }, []);

  const pushHealthPoint = useCallback((healthy: boolean) => {
    setHealthPoints((previous) => {
      const next = [...previous, { at: Date.now(), healthy }];
      return next.slice(-MAX_HEALTH_POINTS);
    });
  }, []);

  const checkHealth = useCallback(
    async (showToast: boolean) => {
      setIsCheckingHealth(true);
      try {
        const response = await fetch(API_ENDPOINTS.scanner_health, {
          method: "GET",
          cache: "no-store",
        });
        const healthy = response.ok;
        setIsScannerHealthy(healthy);
        pushHealthPoint(healthy);

        if (showToast) {
          if (healthy) {
            toast.success("Scanner status is healthy and ready to scan");
          } else {
            toast.error("Scanner is not healthy right now");
          }
        }
      } catch (error) {
        setIsScannerHealthy(false);
        pushHealthPoint(false);
        if (showToast) {
          toast.error("Failed to check scanner health");
        }
        console.error("Health check failed:", error);
      } finally {
        setIsCheckingHealth(false);
      }
    },
    [pushHealthPoint],
  );

  const startTimeline = useCallback((nodes: TreeNode[]) => {
    const entries = nodes
      .filter((node) => !node.isDir)
      .slice(0, 18)
      .map((node, index) => ({
        id: `${node.id}-${index}`,
        label: node.name,
        state: "queued" as const,
      }));

    if (!entries.length) {
      setTimelineSteps([]);
      return () => {};
    }

    setTimelineSteps(entries);

    let index = 0;
    const timer = setInterval(() => {
      setTimelineSteps((current) =>
        current.map((step, stepIndex) => ({
          ...step,
          state: stepIndex === index ? "scanning" : "queued",
        })),
      );
      index = (index + 1) % entries.length;
    }, 280);

    return () => clearInterval(timer);
  }, []);

  const handleFileSelection = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".zip")) {
      toast.error("Please upload a ZIP file");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setScanResults(null);

    try {
      const zip = await JSZip.loadAsync(file);
      const entries = Object.keys(zip.files).filter((entry) => {
        const lower = entry.toLowerCase();
        return (
          lower.endsWith(".py") ||
          lower.endsWith(".ts") ||
          lower.endsWith(".js") ||
          lower.endsWith(".java") ||
          lower.endsWith(".go") ||
          zip.files[entry].dir
        );
      });
      setZipTreeNodes(fileTreeFromZipEntries(entries));
    } catch (error) {
      console.error("ZIP parse failed:", error);
      toast.error("Unable to parse ZIP structure");
      setZipTreeNodes([]);
    }
  };

  const handleRunZipScan = async () => {
    if (!selectedFile || isScanning) return;

    const now = Date.now();
    setIsScanning(true);
    setScanStartedAt(now);
    setScanElapsedMs(0);
    setScanEcgTick(0);
    setScanEcgPoints([62]);
    setScanPipelineProgress(8);
    setScanPipelineStep(0);
    const stopAnimation = startTimeline(zipTreeNodes);
    const pipeAnimationTimer = setInterval(() => {
      setScanPipelineProgress((previous) => {
        const next = Math.min(94, previous + 4);
        if (next >= 66) {
          setScanPipelineStep(2);
        } else if (next >= 33) {
          setScanPipelineStep(1);
        } else {
          setScanPipelineStep(0);
        }
        return next;
      });
    }, 320);

    try {
      const result = await ScannerService.scanZip(selectedFile);
      setScanResults(result);
      setScanElapsedMs(Date.now() - now);
      setScanPipelineProgress(100);
      setScanPipelineStep(2);
      setTimelineSteps((current) =>
        current.map((step) => ({ ...step, state: "done" })),
      );
      toast.success("ZIP scan completed");
      await refreshDashboardMetrics();
    } catch (error) {
      setScanElapsedMs(Date.now() - now);
      setScanPipelineProgress(0);
      setScanPipelineStep(0);
      setTimelineSteps((current) =>
        current.map((step) => ({ ...step, state: "queued" })),
      );
      const message =
        error instanceof Error ? error.message : "ZIP scan failed";
      toast.error(message);
    } finally {
      clearInterval(pipeAnimationTimer);
      stopAnimation();
      setIsScanning(false);
    }
  };

  const handleRunGithubScan = async () => {
    if (!githubRepoUrl.trim() || isScanning) return;

    if (!canUseGithub) {
      setShowGithubUpgradePopup(true);
      return;
    }

    setIsScanning(true);
    try {
      const result = await ScannerService.scanGithub(githubRepoUrl.trim());
      setScanResults(result);
      toast.success("GitHub repository scanned successfully");
      await refreshDashboardMetrics();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "GitHub scan failed";
      toast.error(message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleTabClick = (tab: ScanTab) => {
    if (tab === "github" && !canUseGithub) {
      setShowGithubUpgradePopup(true);
      return;
    }

    if (tab === "scan") {
      setScanResults(null);
      setScanPipelineProgress(0);
      setScanPipelineStep(0);
    }

    setActiveTab(tab);
  };

  useEffect(() => {
    refreshDashboardMetrics();
    checkHealth(false);

    const timer = setInterval(() => {
      void checkHealth(false);
    }, 90000);

    return () => clearInterval(timer);
  }, [checkHealth, refreshDashboardMetrics]);

  useEffect(() => {
    if (!isScanning || scanStartedAt === null) {
      return;
    }

    const timer = setInterval(() => {
      setScanElapsedMs(Date.now() - scanStartedAt);
      setScanEcgTick((previousTick) => {
        const nextTick = previousTick + 1;
        const nextY = buildScanEcgY(nextTick);
        setScanEcgPoints((previousPoints) => {
          const lastPoint =
            previousPoints.length > 0
              ? previousPoints[previousPoints.length - 1]
              : 62;
          const nextY = buildScanEcgY(lastPoint, nextTick);
          return [...previousPoints, nextY].slice(-MAX_SCAN_TIME_POINTS);
        });
        return nextTick;
      });
    }, 140);

    return () => clearInterval(timer);
  }, [isScanning, scanStartedAt]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 rounded-2xl border border-black bg-black p-5 text-white"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">
                Scanner Control Center
              </h1>
              <p className="mt-1 text-sm text-gray-300">
                Upload ZIP archives, run model demo scans, and scan GitHub repos
                from one place.
              </p>
            </div>
            <button
              onClick={() => void checkHealth(true)}
              disabled={isCheckingHealth}
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isCheckingHealth ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              Recheck
            </button>
          </div>
        </motion.section>

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="rounded-2xl border border-purple-200 bg-[#faf5ff] p-4 lg:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-purple-700">
                Scanner Health (3s live polling)
              </p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                  isScannerHealthy
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700",
                )}
              >
                <Activity className="h-3 w-3" />
                {isScannerHealthy ? "Healthy" : "Unhealthy"}
              </span>
            </div>
            <div className="h-24 rounded-lg border border-purple-300 bg-white p-2">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="h-full w-full"
              >
                <line
                  x1="0"
                  y1="80"
                  x2="100"
                  y2="80"
                  stroke="#e9d5ff"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="24"
                  x2="100"
                  y2="24"
                  stroke="#f5e8ff"
                  strokeWidth="1"
                />
                <polyline
                  fill="none"
                  stroke="#7e22ce"
                  strokeWidth="2.5"
                  points={healthPolyline}
                />
              </svg>
            </div>
            <p className="mt-2 text-xs text-purple-700">
              Scanner status is healthy and ready to scan when line stays near
              top.
            </p>
          </Card>

          <Card className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-semibold text-gray-800">Plan Usage</p>
            {dashboardMetrics ? (
              <div className="mt-2 space-y-2 text-sm text-gray-700">
                <p>
                  Plan:{" "}
                  <span className="font-semibold uppercase">
                    {dashboardMetrics.planName}
                  </span>
                </p>
                <p>
                  ZIP Scans used:{" "}
                  <span className="font-semibold">
                    {dashboardMetrics.reportsUsed}
                  </span>
                  {dashboardMetrics.isUnlimited
                    ? " (Unlimited)"
                    : ` / ${dashboardMetrics.reportsLimit}`}
                </p>
                {!dashboardMetrics.isUnlimited ? (
                  <p>
                    Remaining:{" "}
                    <span className="font-semibold">
                      {dashboardMetrics.scansRemaining ?? 0}
                    </span>
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-600">Loading metrics...</p>
            )}
          </Card>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition",
                  active
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-800 hover:border-black",
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.key === "github" && !canUseGithub ? (
                  <Lock className="h-3.5 w-3.5" />
                ) : null}
              </button>
            );
          })}
        </div>

        {activeTab === "scan" ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-black">Upload ZIP</h2>
              <p className="mt-1 text-sm text-gray-600">
                Free account supports up to 3 completed ZIP scans.
              </p>

              <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-400 bg-gray-50 px-4 py-8 text-center transition hover:bg-gray-100">
                <Upload className="h-8 w-8 text-gray-700" />
                <p className="text-sm font-medium text-gray-800">
                  Choose a ZIP archive
                </p>
                <input
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={handleFileSelection}
                />
              </label>

              {selectedFile ? (
                <div className="mt-4 rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-700">
                  Selected:{" "}
                  <span className="font-semibold">{selectedFile.name}</span>
                </div>
              ) : null}

              <button
                onClick={handleRunZipScan}
                disabled={!selectedFile || isScanning}
                className={cn(
                  "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
                  !selectedFile || isScanning
                    ? "cursor-not-allowed bg-gray-300 text-gray-600"
                    : "bg-black text-white hover:bg-gray-800",
                )}
              >
                {isScanning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
                {isScanning ? "Scanning..." : "Start ZIP Scan"}
              </button>
            </Card>

            <Card className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <FolderTree className="h-4 w-4 text-gray-700" />
                <h2 className="text-lg font-semibold text-black">
                  Folder Tree
                </h2>
              </div>

              <div className="max-h-72 space-y-1 overflow-auto rounded-xl border border-gray-200 bg-gradient-to-b from-slate-50 to-white p-3">
                {zipTreeNodes.length ? (
                  zipTreeNodes.map((node, index) => (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(0.01 * index, 0.25) }}
                      className="px-1 py-0.5 font-mono text-xs text-black"
                    >
                      <span className="text-black">
                        {"|   ".repeat(node.depth)}|--{" "}
                      </span>
                      <span>{node.name}</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Tree preview will appear here after ZIP selection.
                  </p>
                )}
              </div>
            </Card>
          </div>
        ) : null}

        {activeTab === "demo" ? (
          <div>
            <DemoTestSection
              onResultsReady={async (result) => {
                setScanResults(result);
                await refreshDashboardMetrics();
              }}
            />
          </div>
        ) : null}

        {activeTab === "github" ? (
          <Card className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-black">
              Scan GitHub Repository
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Pro and Enterprise users can scan public repositories.
            </p>

            <div className="mt-4 space-y-3">
              <input
                type="url"
                value={githubRepoUrl}
                onChange={(event) => setGithubRepoUrl(event.target.value)}
                placeholder="https://github.com/org/repo"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-black"
              />

              <button
                onClick={handleRunGithubScan}
                disabled={isScanning || !githubRepoUrl.trim()}
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
                  isScanning || !githubRepoUrl.trim()
                    ? "cursor-not-allowed bg-gray-300 text-gray-600"
                    : "bg-black text-white hover:bg-gray-800",
                )}
              >
                {isScanning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
                {isScanning ? "Scanning repo..." : "Start GitHub Scan"}
              </button>
            </div>
          </Card>
        ) : null}

        {activeTab === "scan" && isScanning ? (
          <Card className="mt-6 rounded-2xl border-2 border-black bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-black">
                Scan In Progress
              </h3>
              <span className="rounded-full border border-black px-3 py-1 text-xs font-semibold text-black">
                {formatElapsedMs(scanElapsedMs)}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
              <div>
                <p className="text-sm font-medium text-black">
                  3-Stage Scan Pipeline
                </p>
                <p className="mt-0.5 text-xs text-gray-700">
                  AST to Pyre to Pysa execution pipeline.
                </p>

                <div className="mt-3 rounded-full bg-gray-200 h-2 overflow-hidden">
                  <div
                    className="h-full bg-black transition-all duration-300"
                    style={{ width: `${scanPipelineProgress}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  {SCAN_PIPE_STAGES.map((stage, index) => {
                    const reached = index <= scanPipelineStep;
                    const isActive = reached && index === scanPipelineStep;

                    return (
                      <div
                        key={stage.key}
                        className={cn(
                          "rounded-xl border p-3",
                          reached
                            ? "border-black bg-gray-50"
                            : "border-gray-300 bg-white opacity-60",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
                            {isActive ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              stage.title
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-black">
                              {stage.title}
                            </p>
                            <p className="text-[11px] text-gray-700">
                              {stage.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border-2 border-black bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-black">
                  Time ECG
                </p>
                <div className="mt-2 h-28 rounded-lg border border-black bg-white p-2">
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="h-full w-full"
                  >
                    <defs>
                      <filter
                        id="scanEcgGlow"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                      >
                        <feGaussianBlur
                          stdDeviation="1.8"
                          result="coloredBlur"
                        />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <line
                      x1="0"
                      y1="80"
                      x2="100"
                      y2="80"
                      stroke="#c7f9cc"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="58"
                      x2="100"
                      y2="58"
                      stroke="#e8fce9"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="36"
                      x2="100"
                      y2="36"
                      stroke="#e8fce9"
                      strokeWidth="1"
                    />
                    <polyline
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="3.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={scanEcgPolyline}
                    />
                    {scanEcgTip ? (
                      <>
                        <circle
                          cx={scanEcgTip.x}
                          cy={scanEcgTip.y}
                          r="3"
                          fill="#4ade80"
                          opacity="0.45"
                          filter="url(#scanEcgGlow)"
                        />
                        <motion.circle
                          cx={scanEcgTip.x}
                          cy={scanEcgTip.y}
                          r="1.4"
                          fill="#16a34a"
                          filter="url(#scanEcgGlow)"
                          animate={{ r: [1.2, 2, 1.2] }}
                          transition={{ duration: 0.9, repeat: Infinity }}
                        />
                      </>
                    ) : null}
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        ) : null}

        {timelineSteps.length ? (
          <Card className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-700" />
              <h3 className="text-base font-semibold text-black">
                File Scan Timeline
              </h3>
            </div>
            <div className="space-y-2">
              {timelineSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-2 text-sm">
                  {step.state === "done" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : step.state === "scanning" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-black" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                  <span
                    className={cn(
                      step.state === "done" && "text-green-700",
                      step.state === "scanning" && "font-medium text-black",
                      step.state === "queued" && "text-gray-500",
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {scanResults ? (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Card className="rounded-xl border border-black bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-black">
                  Critical
                </p>
                <p className="mt-1 text-2xl font-semibold text-black">
                  {severityCounts.critical}
                </p>
              </Card>
              <Card className="rounded-xl border border-black bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-black">
                  High
                </p>
                <p className="mt-1 text-2xl font-semibold text-black">
                  {severityCounts.high}
                </p>
              </Card>
              <Card className="rounded-xl border border-black bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-black">
                  Medium
                </p>
                <p className="mt-1 text-2xl font-semibold text-black">
                  {severityCounts.medium}
                </p>
              </Card>
              <Card className="rounded-xl border border-black bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-black">
                  Low
                </p>
                <p className="mt-1 text-2xl font-semibold text-black">
                  {severityCounts.low}
                </p>
              </Card>
            </div>

            <Card className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-black">
                  Issues ({totalIssues})
                </h3>
                <span className="text-xs text-gray-500">
                  Cards total always equals listed issues
                </span>
              </div>

              {scanResults.vulnerabilities.length ? (
                <div className="space-y-4">
                  {(
                    ["mcp_ast", "pyre_typing", "pysa_taint", "unknown"] as const
                  ).map((stage) => {
                    const findings = stageGroupedFindings[stage];

                    return (
                      <details
                        key={stage}
                        open={stage !== "unknown"}
                        className="rounded-xl border border-black bg-white"
                      >
                        <summary className="cursor-pointer list-none px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-black">
                                {formatStageTitle(stage)} Details
                              </p>
                              <p className="text-xs text-gray-700">
                                {getStageDescription(stage)}
                              </p>
                            </div>
                            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-black border border-black">
                              {findings.length} issues
                            </span>
                          </div>
                        </summary>

                        <div className="px-4 pb-4">
                          {findings.length ? (
                            <div className="space-y-3">
                              {findings.map((item, index) => (
                                <FindingListItem
                                  key={`${item.file || "issue"}-${stage}-${index}`}
                                  item={item}
                                  index={index}
                                />
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No issues in this stage.
                            </p>
                          )}
                        </div>
                      </details>
                    );
                  })}

                  <details
                    className="rounded-xl border border-black bg-white"
                    open
                  >
                    <summary className="cursor-pointer list-none px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-black">
                          File-wise Details
                        </p>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-black border border-black">
                          {fileGroupedFindings.length} files
                        </span>
                      </div>
                    </summary>

                    <div className="px-4 pb-4 space-y-3">
                      {fileGroupedFindings.map((entry) => (
                        <details
                          key={entry.fileName}
                          className="rounded-lg border border-black bg-white"
                          open
                        >
                          <summary className="cursor-pointer list-none px-3 py-2">
                            <div className="flex items-center justify-between gap-3">
                              <p className="truncate text-sm font-medium text-black">
                                {entry.fileName}
                              </p>
                              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-black border border-black">
                                {entry.findings.length}
                              </span>
                            </div>
                          </summary>

                          <div className="px-3 pb-3 space-y-2">
                            {entry.findings.map((item, index) => (
                              <FindingListItem
                                key={`${entry.fileName}-${index}`}
                                item={item}
                                index={index}
                              />
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </details>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  No issues detected for this scan.
                </p>
              )}
            </Card>
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {showGithubUpgradePopup ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => setShowGithubUpgradePopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="mb-2 flex items-center gap-2">
                <Lock className="h-5 w-5 text-black" />
                <h3 className="text-lg font-semibold text-black">
                  Paid users only
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                GitHub repository scanning is available on Pro and Enterprise
                plans.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setShowGithubUpgradePopup(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Close
                </button>
                <a
                  href="/checkout"
                  className="flex-1 rounded-lg bg-black px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Upgrade to Pro
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
