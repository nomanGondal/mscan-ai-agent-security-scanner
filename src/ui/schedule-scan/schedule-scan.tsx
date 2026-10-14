"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import JSZip from "jszip";
import {
  CalendarClock,
  Clock3,
  FileArchive,
  Loader2,
  Mail,
  Play,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import ScannerService, { ScanResult } from "@/services/scanner";

type ScheduledScanStatus = "pending" | "running" | "completed" | "failed";

type ScheduledScan = {
  id: string;
  file: File;
  fileName: string;
  scheduledFor: string;
  scheduledAtMs: number;
  status: ScheduledScanStatus;
  result?: ScanResult;
  error?: string;
};

const formatTimeLabel = (timestampMs: number) =>
  new Date(timestampMs).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const getTimeRemainingLabel = (scheduledAtMs: number) => {
  const diff = scheduledAtMs - Date.now();
  if (diff <= 0) return "Due now";
  const totalMinutes = Math.ceil(diff / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes} min`;
  return `${hours} h ${minutes} min`;
};

const BRAND = "#D97757";
const DARK = "#1F1F1E";

const statusConfig: Record<
  ScheduledScanStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Pending", color: "#92400e", bg: "#fef3c7" },
  running: { label: "Running", color: "#1e40af", bg: "#dbeafe" },
  completed: { label: "Completed", color: "#166534", bg: "#dcfce7" },
  failed: { label: "Failed", color: "#991b1b", bg: "#fee2e2" },
};

const ScheduleScan = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scheduleAt, setScheduleAt] = useState("");
  const [zipEntries, setZipEntries] = useState<string[]>([]);
  const [scheduledScans, setScheduledScans] = useState<ScheduledScan[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isScanningNow, setIsScanningNow] = useState(false);
  const timersRef = useRef<Record<string, number>>({});

  const nextRun = useMemo(() => {
    return (
      scheduledScans
        .filter((s) => s.status === "pending")
        .sort((a, b) => a.scheduledAtMs - b.scheduledAtMs)[0] ?? null
    );
  }, [scheduledScans]);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((id) =>
        globalThis.clearTimeout(id),
      );
      timersRef.current = {};
    };
  }, []);

  const runScheduledScan = async (scan: ScheduledScan) => {
    const scanId = scan.id;
    setScheduledScans((c) =>
      c.map((e) => (e.id === scanId ? { ...e, status: "running" } : e)),
    );
    setIsScanningNow(true);
    try {
      const result = await ScannerService.scanZip(scan.file);
      if (!result) throw new Error("Scheduled scan did not return a result");
      setScheduledScans((c) =>
        c.map((e) =>
          e.id === scanId ? { ...e, status: "completed", result } : e,
        ),
      );
      toast.success(`Scan finished for ${scan.fileName}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Scheduled scan failed";
      setScheduledScans((c) =>
        c.map((e) =>
          e.id === scanId ? { ...e, status: "failed", error: message } : e,
        ),
      );
      toast.error(message);
    } finally {
      setIsScanningNow(false);
      delete timersRef.current[scanId];
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".zip")) {
      toast.error("Please upload a ZIP file");
      e.target.value = "";
      return;
    }
    setSelectedFile(file);
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
      setZipEntries(entries);
    } catch {
      toast.error("Unable to read ZIP structure");
      setZipEntries([]);
    }
  };

  const handleSchedule = async () => {
    if (!selectedFile || !scheduleAt) {
      toast.error("Please choose a ZIP file and a scheduled time");
      return;
    }
    const scheduledAtMs = new Date(scheduleAt).getTime();
    if (Number.isNaN(scheduledAtMs) || scheduledAtMs <= Date.now()) {
      toast.error("Schedule time must be in the future");
      return;
    }
    setIsScheduling(true);
    try {
      const scheduledScan: ScheduledScan = {
        id: `${selectedFile.name}-${scheduledAtMs}-${Date.now()}`,
        file: selectedFile,
        fileName: selectedFile.name,
        scheduledFor: scheduleAt,
        scheduledAtMs,
        status: "pending",
      };
      setScheduledScans((c) => [...c, scheduledScan]);
      const delay = Math.max(0, scheduledAtMs - Date.now());
      timersRef.current[scheduledScan.id] = globalThis.setTimeout(() => {
        void runScheduledScan(scheduledScan);
      }, delay);
      toast.success("Scan scheduled successfully");
      setScheduleAt("");
      setSelectedFile(null);
      setZipEntries([]);
    } finally {
      setIsScheduling(false);
    }
  };

  const cancelScheduledScan = (scanId: string) => {
    setScheduledScans((c) =>
      c.filter((scan) => {
        if (scan.id !== scanId) return true;
        const timerId = timersRef.current[scanId];
        if (timerId) {
          globalThis.clearTimeout(timerId);
          delete timersRef.current[scanId];
        }
        return false;
      }),
    );
    toast.info("Scheduled scan removed");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
        {/* Page Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ borderColor: BRAND, color: BRAND }}
          >
            <CalendarClock className="h-3.5 w-3.5" />
            Scheduled Scanning
          </div>
          <h1 className="text-4xl font-bold text-black">Schedule a Scan</h1>
          <p className="mt-2 text-gray-500 max-w-2xl text-sm">
            Upload a ZIP archive, pick the exact time, and MVSCAN will run the
            analysis automatically when the schedule is reached.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left — New Schedule Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: BRAND }}
              >
                <CalendarClock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-black">New Schedule</h2>
                <p className="text-xs text-gray-500">
                  Create a future scan job in one step.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* File Input */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  ZIP Archive
                </label>
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700
                    file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:cursor-pointer"
                  style={{ "--file-bg": BRAND } as React.CSSProperties}
                />
                {selectedFile && (
                  <p className="mt-1.5 text-xs text-gray-500">
                    Selected:{" "}
                    <span className="font-medium text-black">
                      {selectedFile.name}
                    </span>
                  </p>
                )}
              </div>

              {/* DateTime Input */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Scan Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduleAt}
                  onChange={(e) => setScheduleAt(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#D97757]"
                />
              </div>

              {/* ZIP Preview */}
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-black mb-2">
                  <FileArchive className="h-4 w-4" style={{ color: BRAND }} />
                  Archive Preview
                </div>
                {zipEntries.length > 0 ? (
                  <div className="max-h-40 overflow-auto rounded-lg bg-white border border-gray-100 p-3">
                    {zipEntries.slice(0, 20).map((entry) => (
                      <p
                        key={entry}
                        className="py-0.5 text-xs text-gray-600 font-mono"
                      >
                        {entry}
                      </p>
                    ))}
                    {zipEntries.length > 20 && (
                      <p className="mt-2 text-xs text-gray-400">
                        +{zipEntries.length - 20} more items
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">
                    Upload a ZIP file to preview its contents.
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={() => void handleSchedule()}
                disabled={isScheduling || isScanningNow}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: BRAND }}
              >
                {isScheduling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Schedule Scan
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Upcoming Jobs */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-black">
                    Upcoming Jobs
                  </h2>
                  <p className="text-xs text-gray-500">
                    Scheduled scans waiting to run.
                  </p>
                </div>
                <Clock3 className="h-5 w-5 text-gray-400" />
              </div>

              {scheduledScans.length > 0 ? (
                <div className="space-y-3">
                  {scheduledScans.map((scan) => {
                    const cfg = statusConfig[scan.status];
                    return (
                      <div
                        key={scan.id}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-black text-sm truncate">
                              {scan.fileName}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatTimeLabel(scan.scheduledAtMs)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                                style={{
                                  backgroundColor: cfg.bg,
                                  color: cfg.color,
                                }}
                              >
                                {cfg.label}
                              </span>
                              {scan.status === "pending" && (
                                <span className="text-xs text-gray-400">
                                  in {getTimeRemainingLabel(scan.scheduledAtMs)}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => cancelScheduledScan(scan.id)}
                            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-red-300 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                          >
                            <Trash2 className="h-3 w-3" />
                            Remove
                          </button>
                        </div>

                        {scan.result && (
                          <div className="mt-3 rounded-lg border border-gray-100 bg-white p-3 grid grid-cols-4 gap-2">
                            {[
                              {
                                label: "Total",
                                val: scan.result.summary.total_issues,
                                color: DARK,
                              },
                              {
                                label: "Critical",
                                val: scan.result.summary.critical_count,
                                color: "#ef4444",
                              },
                              {
                                label: "High",
                                val: scan.result.summary.high_count,
                                color: "#f97316",
                              },
                              {
                                label: "Low",
                                val: scan.result.summary.low_count,
                                color: "#22c55e",
                              },
                            ].map(({ label, val, color }) => (
                              <div key={label} className="text-center">
                                <p className="text-xs text-gray-400">{label}</p>
                                <p
                                  className="text-lg font-bold"
                                  style={{ color }}
                                >
                                  {val}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {scan.error && (
                          <p className="mt-2 text-xs text-red-500">
                            {scan.error}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
                  <Clock3 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    No scans scheduled yet.
                  </p>
                </div>
              )}
            </div>

            {/* Email Delivery Card */}
            <div
              className="rounded-2xl border p-6"
              style={{
                borderColor: "rgba(217,119,87,0.25)",
                backgroundColor: "rgba(217,119,87,0.04)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: BRAND }}
                >
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black">
                    Email Delivery
                  </h2>
                  <p className="text-xs text-gray-500">
                    Results sent automatically after scan.
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed">
                The scheduled scan uses the same pipeline as the scanner page.
                Once complete, the report is sent via your Resend setup.
              </p>

              {nextRun && (
                <div
                  className="mt-4 rounded-xl border p-4"
                  style={{
                    borderColor: "rgba(217,119,87,0.2)",
                    backgroundColor: "white",
                  }}
                >
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Next Run
                  </p>
                  <p className="font-semibold text-black text-sm">
                    {nextRun.fileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimeLabel(nextRun.scheduledAtMs)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ScheduleScan };
