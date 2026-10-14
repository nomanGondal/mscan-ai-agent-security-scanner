"use client";

import React, { useMemo, useState } from "react";
import { Search, X, ChevronDown, Download } from "lucide-react";
import { exportScanResultsToPDF } from "@/utils/export-pdf";
import { toast } from "react-toastify";

// Union type to handle both API response formats
type ScanResultVariant = Record<string, any>;

interface ScanResultsDisplayProps {
  result: ScanResultVariant | null;
}

type SeverityFilter = "all" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

const SEVERITY_ORDER: Record<string, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

const getSeverityColor = (severity: string): string => {
  const upper = (severity || "").toUpperCase();
  switch (upper) {
    case "CRITICAL":
      return "#7F1D1D";
    case "HIGH":
      return "#DC2626";
    case "MEDIUM":
      return "#EA580C";
    case "LOW":
      return "#2563EB";
    default:
      return "#6B7280";
  }
};

const getSeverityBg = (severity: string): string => {
  const upper = (severity || "").toUpperCase();
  switch (upper) {
    case "CRITICAL":
      return "#7F1D1D1A";
    case "HIGH":
      return "#FEE2E2";
    case "MEDIUM":
      return "#FFEDD5";
    case "LOW":
      return "#DBEAFE";
    default:
      return "#F3F4F6";
  }
};

interface VulnerabilityItem {
  file: string;
  line: number;
  type: string;
  rule: string;
  severity: string;
  description: string;
  fix: string;
}

export const ScanResultsDisplay: React.FC<ScanResultsDisplayProps> = ({
  result,
}) => {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [searchText, setSearchText] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Normalize vulnerabilities from both API response formats
  const vulnerabilities = useMemo(() => {
    if (!result) return [];

    // Format 1: issues_details from the actual API response
    if (
      Array.isArray((result as any).issues_details) &&
      (result as any).issues_details.length > 0
    ) {
      return (result as any).issues_details.map((vuln: any) => ({
        file: vuln.file || "",
        line: vuln.line || 0,
        type: vuln.type || "",
        rule: vuln.rule || "",
        severity: (vuln.severity || "").toUpperCase(),
        description: vuln.description || "",
        fix: vuln.fix || "",
      } as VulnerabilityItem));
    }

    // Format 2: vulnerabilities array from ScanResult interface
    if (Array.isArray((result as any).vulnerabilities)) {
      return (result as any).vulnerabilities.map((vuln: any) => ({
        file: vuln.file || "",
        line: vuln.line || 0,
        type: vuln.issueType || vuln.type || "",
        rule: vuln.rule || "",
        severity: (vuln.severity || "").toUpperCase(),
        description: vuln.description || vuln.title || "",
        fix: vuln.recommendation || "",
      } as VulnerabilityItem));
    }

    return [];
  }, [result]);

  // Extract summary
  const summary = useMemo(() => {
    if (!result) {
      return { total: 0, critical: 0, high: 0, medium: 0, low: 0 };
    }

    // Format 1: summary from issues response
    if ((result as any).summary && (result as any).summary.total !== undefined) {
      return {
        total: (result as any).summary.total || 0,
        critical: (result as any).summary.critical || 0,
        high: (result as any).summary.high || 0,
        medium: (result as any).summary.medium || 0,
        low: (result as any).summary.low || 0,
      };
    }

    // Format 2: summary from ScanResult
    if ((result as any).summary) {
      const sum = (result as any).summary;
      const vulns = vulnerabilities;
      return {
        total: sum.total_issues || vulns.length,
        critical:
          sum.critical_count ||
          vulns.filter((v) => v.severity === "CRITICAL").length,
        high:
          sum.high_count || vulns.filter((v) => v.severity === "HIGH").length,
        medium:
          sum.medium_count ||
          vulns.filter((v) => v.severity === "MEDIUM").length,
        low: sum.low_count || vulns.filter((v) => v.severity === "LOW").length,
      };
    }

    // Fallback: calculate from vulnerabilities
    return {
      total: vulnerabilities.length,
      critical: vulnerabilities.filter((v) => v.severity === "CRITICAL")
        .length,
      high: vulnerabilities.filter((v) => v.severity === "HIGH").length,
      medium: vulnerabilities.filter((v) => v.severity === "MEDIUM").length,
      low: vulnerabilities.filter((v) => v.severity === "LOW").length,
    };
  }, [result, vulnerabilities]);

  // Get unique rules
  const uniqueRules = useMemo(() => {
    const rules = new Set(vulnerabilities.map((v) => v.rule));
    return Array.from(rules).sort();
  }, [vulnerabilities]);

  // Filter vulnerabilities
  const filtered = useMemo(() => {
    return vulnerabilities
      .filter((v) => {
        if (severityFilter !== "all" && v.severity !== severityFilter) {
          return false;
        }

        if (searchText.trim()) {
          const search = searchText.toLowerCase();
          return (
            v.file.toLowerCase().includes(search) ||
            v.rule.toLowerCase().includes(search) ||
            v.description.toLowerCase().includes(search) ||
            v.type.toLowerCase().includes(search)
          );
        }

        return true;
      })
      .sort(
        (a, b) =>
          (SEVERITY_ORDER[a.severity] ?? 999) -
          (SEVERITY_ORDER[b.severity] ?? 999)
      );
  }, [vulnerabilities, severityFilter, searchText]);

  // Group by rule
  const groupedByRule = useMemo(() => {
    const groups: Record<string, VulnerabilityItem[]> = {};
    filtered.forEach((vuln) => {
      if (!groups[vuln.rule]) {
        groups[vuln.rule] = [];
      }
      groups[vuln.rule].push(vuln);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  if (!result || vulnerabilities.length === 0) {
    return null;
  }

  // Handle PDF export
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      
      // Get project name from result or use default
      const projectName = (result as any).fileName || 
                         (result as any).projectName || 
                         "Scan Report";
      
      // Generate filename with timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");
      const fileName = `vulnerability_report_${timestamp}.pdf`;

      await exportScanResultsToPDF(
        vulnerabilities,
        summary,
        projectName,
        fileName
      );

      toast.success("PDF exported successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export PDF. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header Summary */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Vulnerability Scan Results
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {summary.total} vulnerabilities found in your code
              </p>
            </div>
            
            {/* Export PDF Button */}
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              <Download size={18} />
              {isExporting ? "Exporting..." : "Export PDF"}
            </button>
          </div>

          {/* Summary Stats */}
          <div
            className={`grid gap-3 ${
              summary.critical > 0 ? "grid-cols-5" : "grid-cols-4"
            }`}
          >
            <div className="bg-white border border-gray-200 rounded px-3 py-2">
              <div className="text-xs font-medium text-gray-600">Total</div>
              <div className="text-xl font-bold text-gray-900 mt-1">
                {summary.total}
              </div>
            </div>

            {summary.critical > 0 && (
              <div
                className="bg-white border rounded px-3 py-2"
                style={{ borderColor: "#991B1B" }}
              >
                <div className="text-xs font-medium" style={{ color: "#7F1D1D" }}>
                  Critical
                </div>
                <div
                  className="text-xl font-bold mt-1"
                  style={{ color: "#7F1D1D" }}
                >
                  {summary.critical}
                </div>
              </div>
            )}

            <div
              className="bg-white border rounded px-3 py-2"
              style={{ borderColor: "#FCA5A5" }}
            >
              <div className="text-xs font-medium" style={{ color: "#DC2626" }}>
                High
              </div>
              <div className="text-xl font-bold mt-1" style={{ color: "#DC2626" }}>
                {summary.high}
              </div>
            </div>

            <div
              className="bg-white border rounded px-3 py-2"
              style={{ borderColor: "#FDBA74" }}
            >
              <div className="text-xs font-medium" style={{ color: "#EA580C" }}>
                Medium
              </div>
              <div
                className="text-xl font-bold mt-1"
                style={{ color: "#EA580C" }}
              >
                {summary.medium}
              </div>
            </div>

            <div
              className="bg-white border rounded px-3 py-2"
              style={{ borderColor: "#93C5FD" }}
            >
              <div className="text-xs font-medium" style={{ color: "#2563EB" }}>
                Low
              </div>
              <div className="text-xl font-bold mt-1" style={{ color: "#2563EB" }}>
                {summary.low}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="border-b border-gray-200 px-6 py-4 bg-white">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by file, rule, or description..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-300"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-3">
            {/* Severity Filter */}
            <div className="flex gap-2">
              {(
                [
                  { value: "all" as const, label: "All Severities" },
                  ...(summary.critical > 0
                    ? [{ value: "CRITICAL" as const, label: "Critical" }]
                    : []),
                  { value: "HIGH" as const, label: "High" },
                  { value: "MEDIUM" as const, label: "Medium" },
                  { value: "LOW" as const, label: "Low" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSeverityFilter(opt.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                    severityFilter === opt.value
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Clear Filters */}
            {(severityFilter !== "all" || searchText) && (
              <button
                onClick={() => {
                  setSeverityFilter("all");
                  setSearchText("");
                }}
                className="px-3 py-1.5 text-xs font-medium rounded border border-gray-200 bg-white text-gray-700 hover:border-gray-300 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-xs text-gray-600">
            Showing {filtered.length} of {vulnerabilities.length} vulnerabilities
          </div>
        </div>
      </div>

      {/* Vulnerabilities List - Grouped by Rule */}
      <div className="divide-y divide-gray-200">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-sm text-gray-600">
              {vulnerabilities.length === 0
                ? "No vulnerabilities found"
                : "No vulnerabilities match your filters"}
            </div>
          </div>
        ) : (
          groupedByRule.map(([rule, items]) => (
            <div key={rule} className="bg-white">
              {/* Rule Header */}
              <button
                onClick={() =>
                  setExpandedRule(expandedRule === rule ? null : rule)
                }
                className="w-full px-6 py-3 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ChevronDown
                      className="w-4 h-4 text-gray-400 transition-transform"
                      style={{
                        transform:
                          expandedRule === rule
                            ? "rotate(180deg)"
                            : "rotate(0)",
                      }}
                    />
                    <span className="font-semibold text-gray-900">{rule}</span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700">
                      {items.length}
                    </span>
                  </div>
                </div>
              </button>

              {/* Rule Items */}
              {expandedRule === rule && (
                <div className="divide-y divide-gray-100">
                  {items.map((vuln, idx) => (
                    <div
                      key={`${rule}-${idx}`}
                      className="bg-white hover:bg-gray-50 transition-colors"
                    >
                      <button
                        onClick={() =>
                          setExpandedIndex(expandedIndex === idx ? null : idx)
                        }
                        className="w-full px-6 py-4 text-left"
                      >
                        <div className="flex items-start gap-4">
                          {/* Severity Indicator */}
                          <div
                            className="flex-shrink-0 w-2 h-full mt-1"
                            style={{
                              backgroundColor: getSeverityColor(vuln.severity),
                            }}
                          />

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3 flex-wrap">
                              {/* Severity Badge */}
                              <span
                                className="px-2 py-1 text-xs font-semibold rounded"
                                style={{
                                  backgroundColor: getSeverityBg(vuln.severity),
                                  color: getSeverityColor(vuln.severity),
                                }}
                              >
                                {vuln.severity}
                              </span>

                              {/* Type Badge */}
                              {vuln.type && (
                                <span className="px-2 py-1 text-xs rounded border border-gray-300 bg-gray-50 text-gray-700">
                                  {vuln.type}
                                </span>
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-sm font-medium text-gray-900 mt-2">
                              {vuln.description}
                            </p>

                            {/* File Location */}
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                              <span className="font-mono">{vuln.file}</span>
                              <span className="text-gray-400">•</span>
                              <span className="font-mono">Line {vuln.line}</span>
                            </div>
                          </div>

                          {/* Expand Indicator */}
                          <div className="flex-shrink-0 mt-1">
                            <ChevronDown
                              className="w-5 h-5 text-gray-400 transition-transform"
                              style={{
                                transform:
                                  expandedIndex === idx
                                    ? "rotate(180deg)"
                                    : "rotate(0)",
                              }}
                            />
                          </div>
                        </div>
                      </button>

                      {/* Expanded Content */}
                      {expandedIndex === idx && (
                        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                          <div className="space-y-4">
                            {/* Full Description */}
                            <div>
                              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                                Details
                              </h4>
                              <p className="text-sm text-gray-700 mt-2">
                                {vuln.description}
                              </p>
                            </div>

                            {/* Fix Recommendation */}
                            {vuln.fix && (
                              <div>
                                <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                                  Recommended Fix
                                </h4>
                                <p className="text-sm text-gray-700 mt-2">
                                  {vuln.fix}
                                </p>
                              </div>
                            )}

                            {/* Location Details */}
                            <div>
                              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                                Location
                              </h4>
                              <div className="mt-2 bg-white border border-gray-200 rounded px-3 py-2 font-mono text-xs text-gray-700">
                                <div>{vuln.file}</div>
                                <div className="text-gray-600">
                                  Line {vuln.line}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
        <p className="text-xs text-gray-600">
          Tip: Click on any vulnerability to see detailed recommendations and
          fix suggestions
        </p>
      </div>
    </div>
  );
};
