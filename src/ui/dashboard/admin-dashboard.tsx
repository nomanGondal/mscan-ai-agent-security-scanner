"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Shield,
  Activity,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalScans: number;
  activeSubscriptions: number;
}

interface AnalyticsData {
  overview: {
    totalScans: number;
    completedScans: number;
    failedScans: number;
    successRate: string | number;
    activeUsers: number;
  };
  severitySummary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  scansBySource: Array<{ _id: string; count: number }>;
  topVulnerabilities: any[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [severityChart, setSeverityChart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch dashboard overview
        const overviewRes = await axios.get("/api/admin");
        const overviewData = overviewRes.data.data;
        setStats(overviewData.overview);

        // Fetch analytics
        const analyticsRes = await axios.get("/api/admin/analytics");
        setAnalytics(analyticsRes.data.data);

        // Fetch chart data
        const chartRes = await axios.get(
          "/api/admin/charts?type=scans-trend&days=30",
        );
        setChartData(chartRes.data.data);

        // Fetch severity chart
        const severityRes = await axios.get(
          "/api/admin/charts?type=severity-distribution&days=30",
        );
        setSeverityChart(severityRes.data.data);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ["#7F1D1D", "#DC2626", "#EA580C", "#2563EB"];

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "#2563EB",
      bgColor: "#DBEAFE",
    },
    {
      title: "Active Subscriptions",
      value: stats?.activeSubscriptions || 0,
      icon: TrendingUp,
      color: "#16A34A",
      bgColor: "#DCFCE7",
    },
    {
      title: "Total Scans",
      value: stats?.totalScans || 0,
      icon: Shield,
      color: "#DC2626",
      bgColor: "#FEE2E2",
    },
    {
      title: "System Admins",
      value: stats?.totalAdmins || 0,
      icon: Activity,
      color: "#EA580C",
      bgColor: "#FFEDD5",
    },
  ];

  if (loading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {card.value.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: card.bgColor }}
                  >
                    <Icon size={24} style={{ color: card.color }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Analytics Summary */}
        {analytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Scan Analytics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overview.totalScans}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {analytics.overview.completedScans}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {analytics.overview.failedScans}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.overview.successRate}%
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Active Users</p>
                <p className="text-2xl font-bold text-purple-600">
                  {analytics.overview.activeUsers}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scans Trend */}
          {chartData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Scans Trend (30 days)
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
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
                    dataKey="completed"
                    stroke="#16A34A"
                    strokeWidth={2}
                    dot={{ fill: "#16A34A" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="failed"
                    stroke="#DC2626"
                    strokeWidth={2}
                    dot={{ fill: "#DC2626" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Severity Distribution */}
          {severityChart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Vulnerability Severity Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityChart.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>

        {/* Top Vulnerabilities */}
        {analytics && analytics.topVulnerabilities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Top Vulnerabilities
            </h2>
            <div className="space-y-4">
              {analytics.topVulnerabilities
                .slice(0, 5)
                .map((vuln: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            vuln.severity === "critical"
                              ? "#7F1D1D"
                              : vuln.severity === "high"
                                ? "#DC2626"
                                : "#EA580C",
                        }}
                      ></div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {vuln._id}
                        </p>
                        <p className="text-sm text-gray-600">
                          Severity: {vuln.severity}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900">{vuln.count}</p>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export { AdminDashboard };
