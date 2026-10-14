"use client";

import { Box } from "@radix-ui/themes";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ShieldAlert,
  Zap,
  TrendingUp,
  Activity,
  Clock,
  FileWarning,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import { NoData } from "@/components/no-data";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";

// ─── Types ────────────────────────────────────────────────────────────────────

type ChartDataItem = { month: string; scans: number; issues: number };
type SeverityDataItem = { name: string; value: number };
type RecentScanItem = {
  fileName: string;
  issuesFound: number;
  critical: number;
  date: string | Date;
  status?: string;
};
type VulnerableFile = {
  file: string;
  fullPath: string;
  issues: number;
  critical: number;
};
type VulnRule = { rule: string; count: number };
type HourlyHealth = { hour: string; status: "up" | "idle" | "error" };
type ActivityItem = {
  id: string;
  fileName: string;
  issuesFound: number;
  critical: number;
  status: string;
  timeAgo: string;
};
type DurationItem = {
  index: number;
  fileName: string;
  durationSeconds: number | null;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const BRAND = "#D97757";
const BRAND_DARK = "#c4623e";
const BRAND_LIGHT = "#f0c4b0";

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated circular risk gauge */
const RiskGauge = ({ score, label }: { score: number; label: string }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 75
      ? "#ef4444"
      : score >= 50
        ? "#f97316"
        : score >= 25
          ? "#eab308"
          : "#22c55e";

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle
          cx={70}
          cy={70}
          r={radius}
          fill="none"
          stroke="#f3ebe7"
          strokeWidth={12}
        />
        <circle
          cx={70}
          cy={70}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)",
          }}
        />
        <text
          x={70}
          y={66}
          textAnchor="middle"
          fontSize={28}
          fontWeight={700}
          fill="#111"
        >
          {score}
        </text>
        <text x={70} y={84} textAnchor="middle" fontSize={11} fill="#9ca3af">
          / 100
        </text>
      </svg>
      <span
        className="mt-1 text-xs font-bold px-3 py-1 rounded-full tracking-wide"
        style={{
          backgroundColor: color + "18",
          color,
          border: `1px solid ${color}30`,
        }}
      >
        {label} Risk
      </span>
    </div>
  );
};

/** Uptime bar */
const HealthBar = ({ status }: { status: "up" | "idle" | "error" }) => {
  const bg =
    status === "up" ? BRAND : status === "error" ? "#ef4444" : "#e5e7eb";
  return (
    <div
      className="h-8 w-full rounded-md transition-all duration-300 hover:scale-y-110 cursor-default"
      style={{ backgroundColor: bg, opacity: status === "idle" ? 0.4 : 1 }}
      title={status}
    />
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  gradient?: boolean;
  progress?: number;
}

const StatCard = ({
  label,
  value,
  sub,
  icon,
  gradient,
  progress,
}: StatCardProps) => {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden"
      style={
        gradient
          ? {
              background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
            }
          : {
              background: "#fff",
              border: "1px solid #f0ece9",
            }
      }
    >
      {/* Decorative circle */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10"
        style={{ backgroundColor: gradient ? "#fff" : "#D97757" }}
      />
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: gradient ? "rgba(255,255,255,0.2)" : `${BRAND}18`,
          }}
        >
          <span style={{ color: gradient ? "#fff" : BRAND }}>{icon}</span>
        </div>
        <ArrowUpRight
          size={16}
          style={{ color: gradient ? "rgba(255,255,255,0.5)" : "#d1c4be" }}
        />
      </div>
      <p
        className="text-sm font-medium mb-1"
        style={{ color: gradient ? "rgba(255,255,255,0.75)" : "#9ca3af" }}
      >
        {label}
      </p>
      <p
        className="text-3xl font-black mb-1 tracking-tight"
        style={{ color: gradient ? "#fff" : "#111" }}
      >
        {value}
      </p>
      {progress !== undefined && (
        <div
          className="w-full rounded-full h-1.5 mt-3 mb-1"
          style={{
            backgroundColor: gradient ? "rgba(255,255,255,0.2)" : "#f3ebe7",
          }}
        >
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              backgroundColor: gradient ? "#fff" : BRAND,
            }}
          />
        </div>
      )}
      <p
        className="text-xs"
        style={{ color: gradient ? "rgba(255,255,255,0.6)" : "#c4a99a" }}
      >
        {sub}
      </p>
    </div>
  );
};

// ─── Section Card ─────────────────────────────────────────────────────────────

const Card = ({
  title,
  icon,
  children,
  accent,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  accent?: boolean;
}) => (
  <div
    className="rounded-2xl p-6 h-full"
    style={{
      background: accent
        ? `linear-gradient(135deg, ${BRAND}08 0%, #fff 60%)`
        : "#fff",
      border: `1px solid ${accent ? BRAND + "25" : "#f0ece9"}`,
    }}
  >
    <div className="flex items-center gap-2 mb-5">
      {icon && (
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${BRAND}18` }}
        >
          <span style={{ color: BRAND }}>{icon}</span>
        </div>
      )}
      <h2 className="text-base font-bold text-gray-900 tracking-tight">
        {title}
      </h2>
    </div>
    {children}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const SectionOne = () => {
  const [metrics, setMetrics] = useState({
    totalScans: 0,
    avgIssuesPerScan: 0,
    criticalIssues: 0,
    scansRemaining: 0 as number | null,
    planName: "free",
    reportsUsed: 0,
    reportsLimit: 3,
    isUnlimited: false,
    upgradeRequired: false,
  });
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [severityData, setSeverityData] = useState<SeverityDataItem[]>([]);
  const [recentScans, setRecentScans] = useState<RecentScanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExtLoading, setIsExtLoading] = useState(true);

  const [riskScore, setRiskScore] = useState<{
    score: number;
    label: string;
    breakdown: { critical: number; high: number; medium: number; low: number };
  } | null>(null);
  const [vulnerableFiles, setVulnerableFiles] = useState<VulnerableFile[]>([]);
  const [vulnRules, setVulnRules] = useState<VulnRule[]>([]);
  const [hourlyHealth, setHourlyHealth] = useState<HourlyHealth[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [durationTrend, setDurationTrend] = useState<DurationItem[]>([]);

  useEffect(() => {
    fetchDashboardData();
    fetchExtendedData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      const result = await response.json();
      if (result.success) {
        const { metrics: m, chartsData, recentScans: s } = result.data;
        setMetrics(m);
        setChartData(chartsData.monthlyTrend);
        setSeverityData(chartsData.severityDistribution);
        setRecentScans(s);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExtendedData = async () => {
    try {
      const response = await fetch("/api/dashboard-extended");
      const result = await response.json();
      if (result.success) {
        const d = result.data;
        setRiskScore(d.riskScore);
        setVulnerableFiles(d.mostVulnerableFiles);
        setVulnRules(d.topVulnerabilityRules);
        setHourlyHealth(d.hourlyHealth);
        setActivityFeed(d.recentActivity);
        setDurationTrend(d.scanDurationTrend);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExtLoading(false);
    }
  };

  const usagePercent =
    metrics.reportsLimit > 0
      ? Math.min(100, (metrics.reportsUsed / metrics.reportsLimit) * 100)
      : 0;

  const maxRuleCount = vulnRules[0]?.count || 1;

  const customTooltip = {
    contentStyle: {
      backgroundColor: "#fff",
      border: "1px solid #f0ece9",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      fontSize: "12px",
    },
  };

  return (
    <Box className="w-full min-h-screen px-8 py-8 bg-white">
      {/* ── Header ── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
            }}
          >
            <ShieldAlert size={20} color="#fff" />
          </div>
          <h1
            className="text-4xl font-black tracking-tight"
            style={{ color: "#111", letterSpacing: "-0.03em" }}
          >
            Dashboard
          </h1>
        </div>
        <p className="text-sm text-gray-400 ml-14 font-medium">
          Your security posture at a glance - real-time analytics & insights
        </p>
      </div>

      {/* ── Upgrade Banner ── */}
      {metrics.upgradeRequired && !metrics.isUnlimited && (
        <div
          className="mb-8 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{
            background: `linear-gradient(135deg, #111 0%, #1f1f1f 100%)`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}
        >
          <div className="flex items-center gap-3">
            <Zap size={18} color={BRAND} />
            <p className="text-sm font-semibold text-white">
              You've used all 3 free ZIP scans.{" "}
              <span style={{ color: BRAND_LIGHT }}>Upgrade to Pro</span> to
              continue.
            </p>
          </div>
          <a
            href="/checkout"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
              color: "#fff",
              boxShadow: `0 4px 16px rgba(217,119,87,0.4)`,
            }}
          >
            <Zap size={14} /> Upgrade Now
          </a>
        </div>
      )}

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <SkeletonWrapper isLoading={isLoading} count={1} height="160px">
          <StatCard
            label="Total Scans"
            value={metrics.totalScans}
            sub="All time scans"
            icon={<Activity size={18} />}
            gradient
          />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={isLoading} count={1} height="160px">
          <StatCard
            label="Avg Issues / Scan"
            value={metrics.avgIssuesPerScan}
            sub="Per scan average"
            icon={<TrendingUp size={18} />}
          />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={isLoading} count={1} height="160px">
          <StatCard
            label="Critical Issues"
            value={metrics.criticalIssues}
            sub="Unresolved critical"
            icon={<AlertTriangle size={18} />}
          />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={isLoading} count={1} height="160px">
          <StatCard
            label="ZIP Scan Usage"
            value={
              metrics.isUnlimited
                ? "∞"
                : `${metrics.reportsUsed}/${metrics.reportsLimit}`
            }
            sub={
              metrics.isUnlimited
                ? "Pro plan — unlimited"
                : `${metrics.scansRemaining ?? 0} scans remaining`
            }
            icon={<ShieldAlert size={18} />}
            progress={metrics.isUnlimited ? 100 : usagePercent}
          />
        </SkeletonWrapper>
      </div>

      {/* ── Risk Score ── */}
      <div className="mb-8">
        <SkeletonWrapper isLoading={isExtLoading} count={1} height="180px">
          {riskScore ? (
            <div
              className="rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8"
              style={{
                background: `linear-gradient(135deg, #fff 0%, ${BRAND}08 100%)`,
                border: `1px solid ${BRAND}20`,
                boxShadow: `0 4px 32px rgba(217,119,87,0.08)`,
              }}
            >
              <div className="flex-shrink-0">
                <RiskGauge score={riskScore.score} label={riskScore.label} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">
                  Overall Risk Score
                </h2>
                <p className="text-sm text-gray-400 mb-5">
                  Weighted across all history - Critical ×10 · High ×5 · Medium
                  ×2 · Low ×1
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    {
                      label: "Critical",
                      value: riskScore.breakdown.critical,
                      color: "#ef4444",
                      bg: "#fef2f2",
                    },
                    {
                      label: "High",
                      value: riskScore.breakdown.high,
                      color: "#f97316",
                      bg: "#fff7ed",
                    },
                    {
                      label: "Medium",
                      value: riskScore.breakdown.medium,
                      color: "#eab308",
                      bg: "#fefce8",
                    },
                    {
                      label: "Low",
                      value: riskScore.breakdown.low,
                      color: "#22c55e",
                      bg: "#f0fdf4",
                    },
                  ].map(({ label, value, color, bg }) => (
                    <div
                      key={label}
                      className="rounded-xl p-4 text-center"
                      style={{
                        backgroundColor: bg,
                        border: `1px solid ${color}22`,
                      }}
                    >
                      <p
                        className="text-xs font-semibold mb-1"
                        style={{ color: color + "99" }}
                      >
                        {label}
                      </p>
                      <p className="text-3xl font-black" style={{ color }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl p-8"
              style={{ border: `1px solid ${BRAND}20`, background: "#fff" }}
            >
              <NoData label="Risk score not available yet — run your first scan!" />
            </div>
          )}
        </SkeletonWrapper>
      </div>

      {/* ── Pipeline Health ── */}
      <div className="mb-8">
        <SkeletonWrapper isLoading={isExtLoading} count={1} height="120px">
          <Card
            title="Scanner Pipeline Health - Last 24h"
            icon={<Activity size={15} />}
            accent
          >
            {hourlyHealth.length > 0 ? (
              <>
                <div className="flex items-center justify-end gap-4 text-xs text-gray-400 mb-3">
                  {[
                    { label: "Active", color: BRAND },
                    { label: "Idle", color: "#e5e7eb" },
                    { label: "Error", color: "#ef4444" },
                  ].map(({ label, color }) => (
                    <span key={label} className="flex items-center gap-1.5">
                      <span
                        className="inline-block w-3 h-3 rounded-sm"
                        style={{ backgroundColor: color }}
                      />
                      {label}
                    </span>
                  ))}
                </div>
                <div
                  className="grid gap-1.5"
                  style={{
                    gridTemplateColumns: `repeat(${hourlyHealth.length}, 1fr)`,
                  }}
                >
                  {hourlyHealth.map((h, i) => (
                    <HealthBar key={i} status={h.status} />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-300 mt-2">
                  <span>24h ago</span>
                  <span>Now</span>
                </div>
              </>
            ) : (
              <NoData label="No pipeline activity in the last 24 hours" />
            )}
          </Card>
        </SkeletonWrapper>
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <SkeletonWrapper isLoading={isLoading} count={3} height="60px">
          <Card
            title="Scans & Issues Trend"
            icon={<TrendingUp size={15} />}
            accent
          >
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ece9" />
                  <XAxis
                    dataKey="month"
                    stroke="#d1c4be"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis stroke="#d1c4be" tick={{ fontSize: 11 }} />
                  <Tooltip {...customTooltip} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="scans"
                    stroke={BRAND}
                    strokeWidth={2.5}
                    dot={{ fill: BRAND, r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: BRAND }}
                  />
                  <Line
                    type="monotone"
                    dataKey="issues"
                    stroke="#c4b5ad"
                    strokeWidth={2.5}
                    dot={{ fill: "#c4b5ad", r: 4, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <NoData label="No trend data yet" />
            )}
          </Card>
        </SkeletonWrapper>

        <SkeletonWrapper isLoading={isLoading} count={3} height="60px">
          <Card title="Issues by Severity" icon={<ShieldAlert size={15} />}>
            {severityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={severityData} barSize={60}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ece9" />
                  <XAxis
                    dataKey="name"
                    stroke="#d1c4be"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis stroke="#d1c4be" tick={{ fontSize: 11 }} />
                  <Tooltip {...customTooltip} />
                  <Bar dataKey="value" fill={BRAND} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <NoData label="No severity data yet" />
            )}
          </Card>
        </SkeletonWrapper>
      </div>

      {/* ── Top Vulnerability Rules ── */}
      <div className="mb-8">
        <SkeletonWrapper isLoading={isExtLoading} count={4} height="40px">
          <Card
            title="Top Vulnerability Rules"
            icon={<FileWarning size={15} />}
            accent
          >
            {vulnRules.length > 0 ? (
              <div className="flex flex-col gap-3">
                {vulnRules.map(({ rule, count }, i) => (
                  <div key={rule} className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{
                        backgroundColor: i === 0 ? BRAND : `${BRAND}18`,
                        color: i === 0 ? "#fff" : BRAND,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="w-52 text-xs font-mono text-gray-600 truncate flex-shrink-0">
                      {rule}
                    </span>
                    <div
                      className="flex-1 rounded-full h-2.5"
                      style={{ backgroundColor: `${BRAND}15` }}
                    >
                      <div
                        className="h-2.5 rounded-full transition-all duration-700"
                        style={{
                          width: `${(count / maxRuleCount) * 100}%`,
                          background: `linear-gradient(90deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-8 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <NoData label="No vulnerability rules triggered yet" />
            )}
          </Card>
        </SkeletonWrapper>
      </div>

      {/* ── Vulnerable Files + Duration ── */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <SkeletonWrapper isLoading={isExtLoading} count={4} height="50px">
          <Card title="Most Vulnerable Files" icon={<FileWarning size={15} />}>
            {vulnerableFiles.length > 0 ? (
              <div className="flex flex-col gap-3">
                {vulnerableFiles.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01]"
                    style={{
                      backgroundColor: i === 0 ? `${BRAND}08` : "#faf8f6",
                    }}
                  >
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{
                        background:
                          i === 0
                            ? `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`
                            : `${BRAND}18`,
                        color: i === 0 ? "#fff" : BRAND,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {f.file}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {f.fullPath}
                      </p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <span
                        className="text-xs px-2 py-1 rounded-lg font-semibold"
                        style={{ backgroundColor: `${BRAND}15`, color: BRAND }}
                      >
                        {f.issues}
                      </span>
                      {f.critical > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-lg font-semibold">
                          {f.critical} crit
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoData label="No vulnerable files detected" />
            )}
          </Card>
        </SkeletonWrapper>

        <SkeletonWrapper isLoading={isExtLoading} count={3} height="60px">
          <Card title="Scan Duration Trend" icon={<Clock size={15} />}>
            {durationTrend.filter((d) => d.durationSeconds !== null).length >
            0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart
                    data={durationTrend.filter(
                      (d) => d.durationSeconds !== null,
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ece9" />
                    <XAxis
                      dataKey="fileName"
                      stroke="#d1c4be"
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis stroke="#d1c4be" tick={{ fontSize: 10 }} unit="s" />
                    <Tooltip
                      {...customTooltip}
                      formatter={(v: number) => [`${v}s`, "Duration"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="durationSeconds"
                      stroke={BRAND}
                      strokeWidth={2.5}
                      dot={{ fill: BRAND, r: 5, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-300 mt-2 text-center">
                  Last{" "}
                  {
                    durationTrend.filter((d) => d.durationSeconds !== null)
                      .length
                  }{" "}
                  completed scans
                </p>
              </>
            ) : (
              <NoData label="No duration data available yet" />
            )}
          </Card>
        </SkeletonWrapper>
      </div>

      {/* ── Activity Feed ── */}
      <div className="mb-8">
        <SkeletonWrapper isLoading={isExtLoading} count={4} height="64px">
          <Card title="Recent Activity" icon={<Activity size={15} />} accent>
            {activityFeed.length > 0 ? (
              <div className="relative">
                <div
                  className="absolute left-[11px] top-0 bottom-0 w-px"
                  style={{ backgroundColor: `${BRAND}25` }}
                />
                <div className="flex flex-col gap-4">
                  {activityFeed.map((item, i) => (
                    <div key={i} className="flex gap-4 relative pl-8">
                      <div
                        className="absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${BRAND}30 0%, ${BRAND}15 100%)`,
                          border: `2px solid ${BRAND}40`,
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: BRAND }}
                        />
                      </div>
                      <div
                        className="flex-1 p-3 rounded-xl"
                        style={{ backgroundColor: "#faf8f6" }}
                      >
                        <p className="text-sm text-gray-800">
                          Scanned{" "}
                          <span className="font-bold" style={{ color: BRAND }}>
                            {item.fileName}
                          </span>
                          {" - "}
                          <span className="font-semibold">
                            {item.issuesFound}
                          </span>{" "}
                          issues
                          {item.critical > 0 && (
                            <span className="ml-1 text-red-500 font-bold">
                              ({item.critical} critical)
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-gray-400">
                            {item.timeAgo}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-md font-semibold inline-flex items-center gap-1"
                            style={
                              item.status === "completed"
                                ? {
                                    backgroundColor: "#f0fdf4",
                                    color: "#16a34a",
                                  }
                                : item.status === "failed"
                                  ? {
                                      backgroundColor: "#fef2f2",
                                      color: "#dc2626",
                                    }
                                  : {
                                      backgroundColor: "#fefce8",
                                      color: "#ca8a04",
                                    }
                            }
                          >
                            {item.status === "completed" ? (
                              <CheckCircle2 size={10} />
                            ) : item.status === "failed" ? (
                              <XCircle size={10} />
                            ) : null}
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <NoData label="No recent activity - start scanning!" />
            )}
          </Card>
        </SkeletonWrapper>
      </div>

      {/* ── Recent Scans Table ── */}
      <SkeletonWrapper isLoading={isLoading} count={5} height="52px">
        <Card title="Recent Scans" icon={<Clock size={15} />}>
          {recentScans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BRAND}15` }}>
                    {["File", "Issues Found", "Critical", "Date", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider"
                          style={{ color: "#c4a99a" }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {recentScans.map((scan, idx) => (
                    <tr
                      key={idx}
                      className="transition-colors hover:bg-orange-50/40"
                      style={{ borderBottom: "1px solid #f8f4f2" }}
                    >
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">
                        {scan.fileName}
                      </td>
                      <td
                        className="py-3 px-4 text-sm font-semibold"
                        style={{ color: BRAND }}
                      >
                        {scan.issuesFound}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-red-500">
                        {scan.critical}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-400">
                        {new Date(scan.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="px-3 py-1 text-xs font-bold rounded-lg inline-flex items-center gap-1"
                          style={
                            scan.status === "completed"
                              ? { backgroundColor: "#f0fdf4", color: "#16a34a" }
                              : { backgroundColor: "#fefce8", color: "#ca8a04" }
                          }
                        >
                          {scan.status === "completed" ? (
                            <CheckCircle2 size={10} />
                          ) : null}
                          {scan.status
                            ? scan.status.charAt(0).toUpperCase() +
                              scan.status.slice(1)
                            : "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <NoData label="No scans yet - upload your first file to get started!" />
          )}
        </Card>
      </SkeletonWrapper>
    </Box>
  );
};

export default SectionOne;
