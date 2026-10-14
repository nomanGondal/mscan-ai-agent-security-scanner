"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanResult } from "@/services/scanner";
import {
  TrendingUp,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/utiils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActualVuln {
  id: string;
  label: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  detected: boolean;
  missed_reason: string | null;
}

interface FalsePositive {
  description: string;
  reason: string;
}

interface DimScore {
  score: number;
  explanation: string;
}

interface GroqAnalysis {
  actual_vulns: ActualVuln[];
  false_positives: FalsePositive[];
  scores: {
    detection: DimScore;
    duplication: DimScore;
    false_positives: DimScore;
    fix_guidance: DimScore;
    severity_accuracy: DimScore;
  };
  overall_score: number;
  verdict: string;
  total_reported: number;
  unique_real_bugs: number;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const fill = circ * (score / 10);
  const color = score >= 8 ? "#34d399" : score >= 5 ? "#fb923c" : "#f87171";

  return (
    <div className="relative flex items-center justify-center w-[84px] h-[84px]">
      <svg width="84" height="84" className="-rotate-90">
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke="#2A2A29"
          strokeWidth="6"
        />
        <motion.circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${fill} ${circ - fill}` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-[22px] font-semibold text-[#EDEDEC]">
          {score}
        </span>
        <span className="text-[9px] text-[#4B4B49]">/10</span>
      </div>
    </div>
  );
}

function DimBar({
  label,
  score,
  explanation,
}: {
  label: string;
  score: number;
  explanation: string;
}) {
  const color = score >= 8 ? "#34d399" : score >= 5 ? "#fb923c" : "#f87171";
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-center gap-3 cursor-default">
        <span className="text-[11px] text-[#9B9B99] w-36 shrink-0">
          {label}
        </span>
        <div className="flex-1 h-1.5 bg-[#2A2A29] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${score * 10}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
        <span
          className="text-[11px] font-semibold tabular-nums w-5 text-right"
          style={{ color }}
        >
          {score}
        </span>
      </div>
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-7 z-10 w-72 bg-[#161615] border border-[#3A3A38] rounded-lg px-3 py-2.5 text-[11px] text-[#9B9B99] leading-relaxed shadow-xl"
          >
            {explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SEV: Record<string, string> = {
  HIGH: "bg-orange-950 text-orange-300 border-orange-800",
  MEDIUM: "bg-yellow-950 text-yellow-300 border-yellow-800",
  LOW: "bg-emerald-950 text-emerald-300 border-emerald-800",
};

const DOT: Record<string, string> = {
  HIGH: "bg-orange-400",
  MEDIUM: "bg-yellow-400",
  LOW: "bg-emerald-400",
};

// ─── Main component ───────────────────────────────────────────────────────────

interface ScannerPerformanceMatrixProps {
  scanResult: ScanResult;
  scannedCode: string;
}

export const ScannerPerformanceMatrix: React.FC<
  ScannerPerformanceMatrixProps
> = ({ scanResult, scannedCode }) => {
  const [analysis, setAnalysis] = useState<GroqAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scanResult || !scannedCode) return;
    const run = async () => {
      setLoading(true);
      setError(null);
      setAnalysis(null);
      try {
        const res = await fetch("/api/analyze_scanner_performance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: scannedCode, scanResult }),
        });
        if (!res.ok) {
          const e = await res.json();
          throw new Error(e.error ?? "Analysis failed");
        }
        setAnalysis(await res.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [scanResult, scannedCode]);

  const scoreColor = !analysis
    ? "#6B6B69"
    : analysis.overall_score >= 8
      ? "#34d399"
      : analysis.overall_score >= 5
        ? "#fb923c"
        : "#f87171";

  const scoreLabel = !analysis
    ? ""
    : analysis.overall_score >= 8
      ? "Great scanner"
      : analysis.overall_score >= 5
        ? "Good scanner"
        : "Needs improvement";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-[#3A3A38] bg-[#1F1F1E] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A29]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2A2A29] flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[#D97757]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#EDEDEC]">
              Scanner performance matrix
            </h3>
            <p className="text-[11px] text-[#6B6B69] mt-0.5">
              AI-evaluated · powered by Groq
            </p>
          </div>
        </div>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border"
            style={{
              color: scoreColor,
              borderColor: scoreColor + "40",
              backgroundColor: scoreColor + "12",
            }}
          >
            <Zap className="w-3 h-3" />
            {scoreLabel}
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* Loading */}
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-3 py-14"
          >
            <Loader2 className="w-6 h-6 text-[#D97757] animate-spin" />
            <p className="text-[12px] text-[#6B6B69]">
              Groq is evaluating scanner performance…
            </p>
          </motion.div>
        )}

        {/* Error */}
        {!loading && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-5 py-6 text-red-400"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p className="text-[12px]">{error}</p>
          </motion.div>
        )}

        {/* Results */}
        {!loading && analysis && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5 space-y-5"
          >
            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-3">
              {[
                {
                  label: "Actual vulns",
                  value: analysis.unique_real_bugs,
                  sub: "in code",
                  color: "#EDEDEC",
                },
                {
                  label: "Detected",
                  value: analysis.actual_vulns.filter((v) => v.detected).length,
                  sub: "caught",
                  color: "#34d399",
                },
                {
                  label: "Missed",
                  value: analysis.actual_vulns.filter((v) => !v.detected)
                    .length,
                  sub: "not caught",
                  color:
                    analysis.actual_vulns.filter((v) => !v.detected).length > 0
                      ? "#f87171"
                      : "#4B4B49",
                },
                {
                  label: "False positives",
                  value: analysis.false_positives.length,
                  sub: "noise",
                  color:
                    analysis.false_positives.length > 0 ? "#fb923c" : "#4B4B49",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-[#161615] border border-[#2A2A29] rounded-xl px-4 py-3"
                >
                  <p className="text-[10px] font-medium uppercase tracking-widest text-[#6B6B69] mb-1">
                    {s.label}
                  </p>
                  <p
                    className="text-2xl font-semibold tabular-nums"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[10px] text-[#4B4B49] mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Vuln table */}
            <div className="rounded-xl border border-[#2A2A29] overflow-hidden">
              <div className="grid grid-cols-[1fr_80px_90px_1fr] text-[10px] font-semibold uppercase tracking-widest text-[#4B4B49] px-4 py-2.5 border-b border-[#2A2A29] bg-[#161615]">
                <span>Vulnerability</span>
                <span>Severity</span>
                <span>Status</span>
                <span>Notes</span>
              </div>
              {analysis.actual_vulns.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={cn(
                    "grid grid-cols-[1fr_80px_90px_1fr] items-center px-4 py-3",
                    i < analysis.actual_vulns.length - 1 &&
                      "border-b border-[#2A2A29]",
                    !v.detected && "bg-red-950/10",
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        DOT[v.severity] ?? "bg-gray-400",
                      )}
                    />
                    <span className="text-xs font-mono text-[#EDEDEC] truncate">
                      {v.label}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded border w-fit",
                      SEV[v.severity],
                    )}
                  >
                    {v.severity.slice(0, 3)}
                  </span>
                  {v.detected ? (
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Detected</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-400">
                      <XCircle className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Missed</span>
                    </div>
                  )}
                  <span className="text-[11px] text-[#4B4B49] truncate pl-1">
                    {v.missed_reason ?? "—"}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* False positives */}
            {analysis.false_positives.length > 0 && (
              <div className="rounded-xl border border-orange-900/40 bg-orange-950/10 overflow-hidden">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-400 px-4 py-2.5 border-b border-orange-900/30">
                  False positives ({analysis.false_positives.length})
                </p>
                {analysis.false_positives.map((fp, i) => (
                  <div
                    key={i}
                    className={cn(
                      "px-4 py-3",
                      i < analysis.false_positives.length - 1 &&
                        "border-b border-orange-900/20",
                    )}
                  >
                    <p className="text-[12px] text-[#EDEDEC] font-mono mb-1">
                      {fp.description}
                    </p>
                    <p className="text-[11px] text-[#6B6B69]">{fp.reason}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Score ring + bars */}
            <div className="grid grid-cols-[auto_1fr] gap-4">
              <div className="flex flex-col items-center justify-center gap-2 bg-[#161615] border border-[#2A2A29] rounded-xl px-5 py-4">
                <ScoreRing score={analysis.overall_score} />
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: scoreColor }}
                >
                  {scoreLabel}
                </span>
              </div>
              <div className="bg-[#161615] border border-[#2A2A29] rounded-xl px-5 py-4 flex flex-col gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#4B4B49] mb-1">
                  Score breakdown{" "}
                  <span className="normal-case font-normal text-[#3A3A38]">
                    · hover for details
                  </span>
                </p>
                <DimBar
                  label="Detection"
                  score={analysis.scores.detection.score}
                  explanation={analysis.scores.detection.explanation}
                />
                <DimBar
                  label="Deduplication"
                  score={analysis.scores.duplication.score}
                  explanation={analysis.scores.duplication.explanation}
                />
                <DimBar
                  label="False positives"
                  score={analysis.scores.false_positives.score}
                  explanation={analysis.scores.false_positives.explanation}
                />
                <DimBar
                  label="Fix guidance"
                  score={analysis.scores.fix_guidance.score}
                  explanation={analysis.scores.fix_guidance.explanation}
                />
                <DimBar
                  label="Severity accuracy"
                  score={analysis.scores.severity_accuracy.score}
                  explanation={analysis.scores.severity_accuracy.explanation}
                />
              </div>
            </div>

            {/* Verdict */}
            <div
              className={cn(
                "flex items-start gap-3 px-4 py-3.5 rounded-xl border",
                analysis.overall_score >= 8
                  ? "bg-emerald-950/20 border-emerald-900/40"
                  : analysis.overall_score >= 5
                    ? "bg-orange-950/20 border-orange-900/40"
                    : "bg-red-950/20 border-red-900/40",
              )}
            >
              <TrendingUp
                className="w-4 h-4 mt-0.5 shrink-0"
                style={{ color: scoreColor }}
              />
              <p className="text-[11px] text-[#9B9B99] leading-relaxed">
                <span className="font-semibold text-[#EDEDEC]">
                  AI Verdict:{" "}
                </span>
                {analysis.verdict}
              </p>
            </div>

            <p className="text-[10px] text-[#3A3A38] text-center">
              Evaluated by Groq · llama-3.1-8b-instant
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ScannerPerformanceMatrix;
