"use client";

import React, { useMemo, useState } from "react";
import { ScanResult } from "@/services/scanner";
import { Search, X, ChevronDown } from "lucide-react";

interface ScanResponse {
  project_id?: string;
  issues_count?: number;
  issues_details?: Array<{
    file: string;
    line: number;
    type: string;
    rule: string;
    severity: string;
    description: string;
    fix: string;
  }>;
  summary?: {
    total?: number;
    high?: number;
    medium?: number;
    low?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

interface ScanResultsDisplayProps {
  result: ScanResult | ScanResponse | null;
}

type SeverityFilter = "all" | "HIGH" | "MEDIUM" | "LOW";

const SEVERITY_ORDER: Record<string, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

const getSeverityColor = (severity: string): string => {
  const upper = severity.toUpperCase();
  switch (upper) {
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
  const upper = severity.toUpperCase();
  switch (upper) {
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

export const ScanResultsDisplay: React.FC<ScanResultsDisplayProps> = ({
  result,
}) => {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [searchText, setSearchText] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  // Extract vulnerabilities from the result
  const vulnerabilities = useMemo(() => {
    if (!result) return [];

    const items = (result as ScanResponse).issues_details || [];
    return items.map((vuln) => ({
      ...vuln,
      severity: vuln.severity.toUpperCase(),
    }));
  }, [result]);

  // Extract summary
  const summary = useMemo(() => {
    if (!result) {
      return { total: 0, high: 0, medium: 0, low: 0 };
    }

    const sum = (result as ScanResponse).summary || {};
    return {
      total: sum.total || vulnerabilities.length,
      high: sum.high || vulnerabilities.filter((v) => v.severity === "HIGH").length,
      medium: sum.medium || vulnerabilities.filter((v) => v.severity === "MEDIUM").length,
      low: sum.low || vulnerabilities.filter((v) => v.severity === "LOW").length,
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
    const groups: Record<string, typeof vulnerabilities> = {};
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

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header Summary */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Vulnerability Scan Results
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {summary.total} vulnerabilities found in your code
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded px-3 py-2">
              <div className="text-xs font-medium text-gray-600">Total</div>
              <div className="text-xl font-bold text-gray-900 mt-1">
                {summary.total}
              </div>
            </div>

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
              <div className="text-xl font-bold mt-1" style={{ color: "#EA580C" }}>
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
                          expandedRule === rule ? "rotate(180deg)" : "rotate(0)",
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
                      key={idx}
                      className="bg-white hover:bg-gray-50 transition-colors"
                    >
                      <button
                        onClick={() =>
                          setExpandedIndex(
                            expandedIndex === idx ? null : idx
                          )
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
                              <span className="px-2 py-1 text-xs rounded border border-gray-300 bg-gray-50 text-gray-700">
                                {vuln.type}
                              </span>
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
                            <div>
                              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                                Recommended Fix
                              </h4>
                              <p className="text-sm text-gray-700 mt-2">
                                {vuln.fix}
                              </p>
                            </div>

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
