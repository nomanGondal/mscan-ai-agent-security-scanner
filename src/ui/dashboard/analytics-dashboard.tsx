"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, FileText } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

interface AnalyticsData {
  date: string;
  total?: number;
  completed?: number;
  failed?: number;
  newUsers?: number;
  totalUsers?: number;
}

interface VulnerabilityStats {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
}

const AnalyticsDashboard = () => {
  const [scansTrend, setScansTrend] = useState<AnalyticsData[]>([]);
  const [userGrowth, setUserGrowth] = useState<AnalyticsData[]>([]);
  const [topFiles, setTopFiles] = useState<any[]>([]);
  const [severityData, setSeverityData] = useState<VulnerabilityStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAnalyticsData();
  }, [days]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch scans trend
      const scansRes = await axios.get(
        `/api/admin/charts?type=scans-trend&days=${days}`,
      );
      setScansTrend(scansRes.data.data);

      // Fetch user growth
      const userRes = await axios.get(
        `/api/admin/charts?type=user-growth&days=${days}`,
      );
      setUserGrowth(userRes.data.data);

      // Fetch analytics with top files
      const analyticsRes = await axios.get("/api/admin/analytics");
      setTopFiles(analyticsRes.data.data.topFiles || []);
      setSeverityData(analyticsRes.data.data.severitySummary || {});
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Content */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex gap-4 items-center flex-wrap">
            <label className="text-sm font-semibold text-gray-900">
              Time Range:
            </label>
            <div className="flex gap-2">
              {[7, 14, 30, 90].map((day) => (
                <button
                  key={day}
                  onClick={() => setDays(day)}
                  className={`px-4 py-2 rounded-lg transition font-semibold ${
                    days === day
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Last {day}d
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scans Trend */}
          {scansTrend.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Scans Trend
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={scansTrend}>
                  <defs>
                    <linearGradient
                      id="colorCompleted"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorFailed"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f3f4f6",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#16A34A"
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                  />
                  <Area
                    type="monotone"
                    dataKey="failed"
                    stroke="#DC2626"
                    fillOpacity={1}
                    fill="url(#colorFailed)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* User Growth */}
          {userGrowth.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                User Growth
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f3f4f6",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#EA580C"
                    strokeWidth={2}
                    dot={{ fill: "#EA580C" }}
                    name="New Users"
                  />
                  <Line
                    type="monotone"
                    dataKey="totalUsers"
                    stroke="#2563EB"
                    strokeWidth={2}
                    dot={{ fill: "#2563EB" }}
                    name="Total Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>

        {/* Top Vulnerable Files */}
        {topFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Most Vulnerable Files
            </h2>
            <div className="space-y-3">
              {topFiles.slice(0, 8).map((file: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <FileText size={20} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {file._id || "Unknown File"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Issues found: {file.count}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {file.count}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Detailed Statistics Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Daily Breakdown
          </h2>
          {scansTrend.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-900">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Total
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Completed
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Failed
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Success Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scansTrend.slice(-14).map((item, idx) => {
                    const successRate =
                      item.total && item.total > 0
                        ? (((item.completed || 0) / item.total) * 100).toFixed(
                            1,
                          )
                        : "0";
                    return (
                      <tr
                        key={idx}
                        className={`border-b border-gray-200 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-3">{item.date}</td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {item.total}
                        </td>
                        <td className="px-4 py-3 text-right text-green-600">
                          {item.completed}
                        </td>
                        <td className="px-4 py-3 text-right text-red-600">
                          {item.failed}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {successRate}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export { AnalyticsDashboard };
