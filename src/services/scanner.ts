import { API_ENDPOINTS } from "@/actions";
import axios, { AxiosError } from "axios";

export interface ScanRequest {
  filename: string;
  code: string;
}

export interface ScanResult {
  project_id: string;
  status: string;
  vulnerabilities: Vulnerability[];
  summary: {
    total_issues: number;
    critical_count: number;
    high_count: number;
    medium_count: number;
    low_count: number;
  };
  analysisBreakdown?: {
    ast: number;
    pyre: number;
    pysa: number;
  };
  files_analyzed: number;
  scan_time?: number;
  timestamp?: string;
}

export interface Vulnerability {
  id?: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  rule?: string;
  issueType?: string;
  analysisStage?: "mcp_ast" | "pyre_typing" | "pysa_taint" | "unknown";
  file?: string;
  line?: number;
  column?: number;
  code_snippet?: string;
  recommendation?: string;
  cwe?: string;
  owasp?: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: ScanResult;
  [key: string]: unknown;
}

interface BackendScanIssue {
  severity?: "critical" | "high" | "medium" | "low" | string;
  type?: string;
  rule?: string;
  stage?: "mcp_ast" | "pyre_typing" | "pysa_taint" | "unknown" | string;
  description?: string;
  file?: string;
  line?: number;
  column?: number;
  code?: string;
  fix?: string;
  recommendation?: string;
  cwe?: string;
  owasp?: string;
}

interface BackendScanResponse {
  project_id?: string;
  issues_count?: number;
  issues_details?: BackendScanIssue[];
  summary?: {
    total?: number;
    high?: number;
    medium?: number;
    low?: number;
    pyre_issues?: number;
    pysa_issues?: number;
    mcp_issues?: number;
  };
  debug?: {
    duration_seconds?: number;
  };
}

interface PersistedScanIssue {
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  description: string;
  stage: "mcp_ast" | "pyre_typing" | "pysa_taint" | "unknown";
  line: number;
  column: number;
  file?: string;
  code?: string;
}

const normalizeSeverity = (
  severity?: string,
): "critical" | "high" | "medium" | "low" => {
  const normalizedSeverity = severity?.toLowerCase();
  if (
    normalizedSeverity === "critical" ||
    normalizedSeverity === "high" ||
    normalizedSeverity === "medium" ||
    normalizedSeverity === "low"
  ) {
    return normalizedSeverity;
  }
  return "low";
};

const inferAnalysisStage = (
  issue: BackendScanIssue,
): "mcp_ast" | "pyre_typing" | "pysa_taint" | "unknown" => {
  const explicitType = issue.type?.toLowerCase();
  if (explicitType === "pyre") {
    return "pyre_typing";
  }
  if (explicitType === "pysa") {
    return "pysa_taint";
  }

  const explicitStage = issue.stage?.toLowerCase();
  if (
    explicitStage === "mcp_ast" ||
    explicitStage === "pyre_typing" ||
    explicitStage === "pysa_taint" ||
    explicitStage === "unknown"
  ) {
    return explicitStage;
  }

  const searchText =
    `${issue.type ?? ""} ${issue.rule ?? ""} ${issue.description ?? ""}`.toLowerCase();

  if (
    searchText.includes("undefined import") ||
    searchText.includes("undefined or invalid type") ||
    searchText.includes("call error") ||
    searchText.includes("invalid decoration") ||
    searchText.includes("unbound name") ||
    searchText.includes("annotation") ||
    searchText.includes("type")
  ) {
    return "pyre_typing";
  }

  if (
    searchText.includes("ssrf") ||
    searchText.includes("shell injection") ||
    searchText.includes("command injection") ||
    searchText.includes("file system access") ||
    searchText.includes("deserializ") ||
    searchText.includes("path traversal") ||
    searchText.includes("prompt injection") ||
    searchText.includes("taint") ||
    searchText.includes("sql injection")
  ) {
    return "pysa_taint";
  }

  return "mcp_ast";
};

const pickErrorMessage = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return undefined;
};

const toFrontendScanResult = (data: BackendScanResponse): ScanResult => {
  const vulnerabilities = (data.issues_details ?? []).map((issue) => ({
    severity: normalizeSeverity(issue.severity),
    title: issue.type || issue.rule || "Finding",
    description: issue.description || issue.rule || "",
    rule: issue.rule,
    issueType: issue.type,
    analysisStage: inferAnalysisStage(issue),
    file: issue.file,
    line: issue.line,
    column: issue.column,
    code_snippet: issue.code || issue.fix,
    recommendation: issue.recommendation || issue.fix,
    cwe: issue.cwe,
    owasp: issue.owasp,
  }));

  const criticalCount = vulnerabilities.filter(
    (issue) => issue.severity === "critical",
  ).length;
  const highCount = vulnerabilities.filter(
    (issue) => issue.severity === "high",
  ).length;
  const mediumCount = vulnerabilities.filter(
    (issue) => issue.severity === "medium",
  ).length;
  const lowCount = vulnerabilities.filter(
    (issue) => issue.severity === "low",
  ).length;

  const stageAstCount = vulnerabilities.filter(
    (issue) => issue.analysisStage === "mcp_ast",
  ).length;
  const stagePyreCount = vulnerabilities.filter(
    (issue) => issue.analysisStage === "pyre_typing",
  ).length;
  const stagePysaCount = vulnerabilities.filter(
    (issue) => issue.analysisStage === "pysa_taint",
  ).length;

  const filesAnalyzed = new Set(
    vulnerabilities
      .map((issue) => issue.file)
      .filter((value): value is string => Boolean(value)),
  ).size;

  return {
    project_id: data.project_id || "demo-project",
    status: "completed",
    vulnerabilities,
    summary: {
      total_issues: vulnerabilities.length,
      critical_count: criticalCount,
      high_count: highCount,
      medium_count: mediumCount,
      low_count: lowCount,
    },
    analysisBreakdown: {
      ast: data.summary?.mcp_issues ?? stageAstCount,
      pyre: data.summary?.pyre_issues ?? stagePyreCount,
      pysa: data.summary?.pysa_issues ?? stagePysaCount,
    },
    files_analyzed: filesAnalyzed || (vulnerabilities.length ? 1 : 0),
    scan_time: data.debug?.duration_seconds,
    timestamp: new Date().toISOString(),
  };
};

const persistCompletedScan = async (payload: {
  fileName: string;
  fileSize: number;
  fileContent?: string;
  scanSource: "zip" | "model" | "github" | "demo";
  result: ScanResult;
}) => {
  const issues: PersistedScanIssue[] = payload.result.vulnerabilities.map(
    (issue) => ({
      severity: issue.severity,
      type: issue.title,
      description: issue.description,
      stage: issue.analysisStage ?? "unknown",
      line: issue.line ?? 0,
      column: issue.column ?? 0,
      file: issue.file,
      code: issue.code_snippet,
    }),
  );

  await fetch("/api/scans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: payload.fileName,
      fileSize: payload.fileSize,
      fileContent: payload.fileContent,
      scanSource: payload.scanSource,
      status: "completed",
      completedAt: new Date().toISOString(),
      duration: Math.round((payload.result.scan_time ?? 0) * 1000),
      issues,
      severitySummary: {
        critical: payload.result.summary.critical_count,
        high: payload.result.summary.high_count,
        medium: payload.result.summary.medium_count,
        low: payload.result.summary.low_count,
      },
      analysisTools: {
        mcp_ast: true,
        pyre_typing: true,
        pysa_taint: true,
      },
    }),
  });
};

const ScannerService = {
  async scanModel(
    request: ScanRequest,
    signal?: AbortSignal,
  ): Promise<ScanResult | null> {
    try {
      const response = await axios.post<ScanResult>(
        API_ENDPOINTS.scanner_scan_model,
        request,
        { signal },
      );
      const result = toFrontendScanResult(
        response.data as unknown as BackendScanResponse,
      );

      await persistCompletedScan({
        fileName: request.filename,
        fileSize: request.code.length,
        fileContent: request.code,
        scanSource: "model",
        result,
      });

      return result;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.code === "ERR_CANCELLED") {
        throw new Error("Request cancelled");
      }
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Scan failed",
      );
    }
  },

  async scanZip(file: File, signal?: AbortSignal): Promise<ScanResult | null> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post<BackendScanResponse>(
        API_ENDPOINTS.scanner_scan_zip,
        formData,
        {
          signal,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const result = toFrontendScanResult(response.data);

      await persistCompletedScan({
        fileName: file.name,
        fileSize: file.size,
        scanSource: "zip",
        result,
      });

      return result;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.code === "ERR_CANCELLED") {
        throw new Error("Request cancelled");
      }
      if (axiosError.response?.status === 403) {
        throw new Error(
          pickErrorMessage(
            axiosError.response?.data?.error,
            axiosError.response?.data?.message,
            "Free plan allows only 3 ZIP scans. Please upgrade to Pro.",
          ) || "Free plan allows only 3 ZIP scans. Please upgrade to Pro.",
        );
      }
      throw new Error(
        pickErrorMessage(
          axiosError.response?.data?.message,
          axiosError.response?.data?.detail,
          axiosError.message,
          "ZIP scan failed",
        ) || "ZIP scan failed",
      );
    }
  },

  async scanGithub(
    url: string,
    githubToken?: string,
    signal?: AbortSignal,
  ): Promise<ScanResult | null> {
    try {
      const response = await axios.post<BackendScanResponse>(
        API_ENDPOINTS.scanner_scan_github,
        { url, github_token: githubToken },
        { signal },
      );
      const result = toFrontendScanResult(response.data);

      await persistCompletedScan({
        fileName: url,
        fileSize: 0,
        scanSource: "github",
        result,
      });

      return result;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.code === "ERR_CANCELLED") {
        throw new Error("Request cancelled");
      }
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "GitHub scan failed",
      );
    }
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(API_ENDPOINTS.scanner_health);
      return response.status === 200;
    } catch {
      return false;
    }
  },
};

export default ScannerService;
