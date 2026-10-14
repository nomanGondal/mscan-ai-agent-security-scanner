"use client";

import { Box } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import React from "react";

type ScanIssue = {
  severity: string;
  type: string;
  description: string;
  stage?: string;
  line: number;
  column: number;
  code?: string;
};

type ScanRecord = {
  _id: string;
  fileName: string;
  issues: ScanIssue[];
  severitySummary?: {
    critical?: number;
    high?: number;
    medium?: number;
    low?: number;
  };
  createdAt?: string | Date;
  duration?: number;
  status: string;
  analysisTools?: {
    mcp_ast?: boolean;
    pyre_typing?: boolean;
    pysa_taint?: boolean;
  };
};

const getStageLabel = (stage?: string) => {
  switch (stage) {
    case "mcp_ast":
      return "AST";
    case "pyre_typing":
      return "Pyre";
    case "pysa_taint":
      return "Pysa";
    default:
      return "Other";
  }
};

export default function ScanHistoryPage() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedScanId, setExpandedScanId] = useState<string | null>(null);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const response = await fetch("/api/scans");
      const result = await response.json();
      if (result.success) {
        setScans(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch scans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredScans =
    filterStatus === "all"
      ? scans
      : scans.filter((s) => s.status === filterStatus);

  return (
    <Box>
      <Box className="w-full px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Scan History</h1>
          <p className="text-gray-600">
            View all your completed scans and their results
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          {["all", "completed", "analyzing", "failed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Scans Table */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              Loading scans...
            </div>
          ) : filteredScans.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No scans found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">
                    File Name
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">
                    Issues
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">
                    Critical
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">
                    Scan Date
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">
                    Duration
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredScans.map((scan, idx) => (
                  <React.Fragment key={idx}>
                    <tr
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition"
                      onClick={() =>
                        setExpandedScanId(
                          expandedScanId === scan._id ? null : scan._id,
                        )
                      }
                    >
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-lg">
                            {expandedScanId === scan._id ? "−" : "+"}
                          </span>
                          {scan.fileName}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {scan.issues?.length || 0}
                      </td>
                      <td className="py-4 px-6 text-sm text-red-600 font-semibold">
                        {scan.severitySummary?.critical || 0}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(
                          scan.createdAt ?? Date.now(),
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {scan.duration
                          ? `${(scan.duration / 1000).toFixed(2)}s`
                          : "-"}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            scan.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : scan.status === "analyzing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {scan.status.charAt(0).toUpperCase() +
                            scan.status.slice(1)}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Details */}
                    {expandedScanId === scan._id && (
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <td colSpan={6} className="py-6 px-6">
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-bold text-black mb-4 text-lg">
                                Scan Details
                              </h3>
                              <div className="grid grid-cols-4 gap-4 mb-6">
                                <div className="bg-white border border-gray-300 rounded p-4">
                                  <p className="text-xs text-gray-600 mb-1">
                                    Total Issues
                                  </p>
                                  <p className="text-2xl font-bold text-black">
                                    {scan.issues?.length || 0}
                                  </p>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded p-4">
                                  <p className="text-xs text-gray-600 mb-1">
                                    Critical
                                  </p>
                                  <p className="text-2xl font-bold text-red-600">
                                    {scan.severitySummary?.critical || 0}
                                  </p>
                                </div>
                                <div className="bg-orange-50 border border-orange-200 rounded p-4">
                                  <p className="text-xs text-gray-600 mb-1">
                                    High
                                  </p>
                                  <p className="text-2xl font-bold text-orange-600">
                                    {scan.severitySummary?.high || 0}
                                  </p>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                                  <p className="text-xs text-gray-600 mb-1">
                                    Medium/Low
                                  </p>
                                  <p className="text-2xl font-bold text-yellow-600">
                                    {(scan.severitySummary?.medium || 0) +
                                      (scan.severitySummary?.low || 0)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Issues List */}
                            {scan.issues && scan.issues.length > 0 && (
                              <div>
                                <h4 className="font-bold text-black mb-4 text-base">
                                  Stage Reports
                                </h4>
                                <div className="grid gap-4 md:grid-cols-3 mb-6">
                                  {(
                                    [
                                      "mcp_ast",
                                      "pyre_typing",
                                      "pysa_taint",
                                    ] as const
                                  ).map((stage) => {
                                    const stageIssues = (
                                      scan.issues ?? []
                                    ).filter(
                                      (issue) =>
                                        (issue.stage || "unknown") === stage,
                                    );

                                    return (
                                      <div
                                        key={stage}
                                        className="bg-white border border-gray-300 rounded p-4"
                                      >
                                        <div className="flex items-center justify-between gap-3">
                                          <div>
                                            <p className="font-semibold text-black">
                                              {getStageLabel(stage)}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                              {stage === "mcp_ast"
                                                ? "AST and source-pattern findings"
                                                : stage === "pyre_typing"
                                                  ? "Type-checking findings"
                                                  : "Taint-flow findings"}
                                            </p>
                                          </div>
                                          <div className="px-3 py-1 rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                                            {stageIssues.length}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                <h4 className="font-bold text-black mb-4 text-base">
                                  Detected Issues
                                </h4>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                  {scan.issues.map((issue, issueIdx) => (
                                    <div
                                      key={issueIdx}
                                      className="bg-white border border-gray-300 rounded p-4"
                                    >
                                      <div className="flex items-start gap-3">
                                        <div
                                          className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                                            issue.severity === "critical"
                                              ? "bg-red-100 text-red-700"
                                              : issue.severity === "high"
                                                ? "bg-orange-100 text-orange-700"
                                                : issue.severity === "medium"
                                                  ? "bg-yellow-100 text-yellow-700"
                                                  : "bg-blue-100 text-blue-700"
                                          }`}
                                        >
                                          {issue.severity.toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold text-black">
                                              {issue.type}
                                            </p>
                                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold">
                                              {getStageLabel(issue.stage)}
                                            </span>
                                          </div>
                                          <p className="text-sm text-gray-600 mt-1">
                                            {issue.description}
                                          </p>
                                          <p className="text-xs text-gray-500 mt-2 font-mono">
                                            Line {issue.line}, Column{" "}
                                            {issue.column}
                                          </p>
                                          {issue.code && (
                                            <div className="mt-2 bg-gray-900 text-gray-300 rounded p-2 text-xs font-mono overflow-x-auto">
                                              {issue.code}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {scan.analysisTools && (
                              <div>
                                <h4 className="font-bold text-black mb-3 text-base">
                                  Analysis Tools Used
                                </h4>
                                <div className="flex gap-4">
                                  {scan.analysisTools.mcp_ast && (
                                    <div className="bg-white border border-gray-300 rounded px-4 py-2">
                                      <p className="text-sm font-semibold text-black">
                                        MCP AST Analysis
                                      </p>
                                    </div>
                                  )}
                                  {scan.analysisTools.pyre_typing && (
                                    <div className="bg-white border border-gray-300 rounded px-4 py-2">
                                      <p className="text-sm font-semibold text-black">
                                        Pyre Type Checking
                                      </p>
                                    </div>
                                  )}
                                  {scan.analysisTools.pysa_taint && (
                                    <div className="bg-white border border-gray-300 rounded px-4 py-2">
                                      <p className="text-sm font-semibold text-black">
                                        Pysa Taint Analysis
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Box>
    </Box>
  );
}
