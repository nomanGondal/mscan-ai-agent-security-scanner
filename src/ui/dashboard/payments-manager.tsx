"use client";

import { useEffect, useState } from "react";
import { CreditCard, TrendingUp, Users, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

interface Payment {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  plan: string;
  stripeCustomerId?: string;
  subscriptionStatus: string;
  subscriptionEndAt?: string;
  createdAt: string;
}

interface PaymentStats {
  total: number;
  activeCount: number;
  pastDueCount: number;
  cancelledCount: number;
  planBreakdown: Array<{ _id: string; count: number }>;
  totalRevenue?: number;
  activeRevenue?: number;
  averageRevenuePerCustomer?: number;
  monthlyRecurringRevenue?: number;
}

const PaymentsManager = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchPayments();
  }, [page, limit, filterStatus]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/payments", {
        params: {
          page,
          limit,
          ...(filterStatus && { status: filterStatus }),
        },
      });

      setPayments(res.data.data);
      setStats(res.data.stats);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return { bg: "#DCFCE7", text: "#16A34A" };
      case "past_due":
        return { bg: "#FFEDD5", text: "#EA580C" };
      case "cancelled":
        return { bg: "#FEE2E2", text: "#DC2626" };
      default:
        return { bg: "#F3F4F6", text: "#6B7280" };
    }
  };

  const totalPages = Math.ceil((stats?.total || 0) / limit);

  return (
    <div className="space-y-8">
      {/* Content */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Total Subscriptions
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100">
                  <CreditCard size={24} style={{ color: "#2563EB" }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.activeCount}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-100">
                  <Users size={24} style={{ color: "#16A34A" }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Past Due</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {stats.pastDueCount}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-100">
                  <TrendingUp size={24} style={{ color: "#EA580C" }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cancelled</p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats.cancelledCount}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-100">
                  <DollarSign size={24} style={{ color: "#DC2626" }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Revenue Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${(stats.totalRevenue || 0).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <DollarSign size={24} style={{ color: "#9333EA" }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Active Accounts Revenue
                  </p>
                  <p className="text-3xl font-bold text-emerald-600">
                    ${(stats.activeRevenue || 0).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-100">
                  <TrendingUp size={24} style={{ color: "#059669" }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Avg Revenue per Customer
                  </p>
                  <p className="text-3xl font-bold text-indigo-600">
                    ${(stats.averageRevenuePerCustomer || 0).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-indigo-100">
                  <CreditCard size={24} style={{ color: "#4F46E5" }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Monthly Recurring Revenue
                  </p>
                  <p className="text-3xl font-bold text-cyan-600">
                    ${(stats.monthlyRecurringRevenue || 0).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-cyan-100">
                  <TrendingUp size={24} style={{ color: "#0891B2" }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Plan Breakdown */}
        {stats && stats.planBreakdown.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Subscriptions by Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.planBreakdown.map((item: any) => (
                <div
                  key={item._id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <p className="font-semibold text-gray-900 capitalize">
                    {item._id}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {item.count}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {stats.total > 0
                      ? ((item.count / stats.total) * 100).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex gap-4 items-center flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="past_due">Past Due</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </motion.div>

        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading payments...</p>
            </div>
          ) : payments.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-900">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">
                        User
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Stripe ID
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Ends At
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Since
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, idx) => {
                      const statusColor = getStatusColor(
                        payment.subscriptionStatus,
                      );
                      return (
                        <tr
                          key={payment._id}
                          className={`border-b border-gray-200 ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-blue-50 transition`}
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold">
                                {payment.user.username}
                              </p>
                              <p className="text-xs text-gray-500">
                                {payment.user.email}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                              {payment.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize"
                              style={{
                                backgroundColor: statusColor.bg,
                                color: statusColor.text,
                              }}
                            >
                              {payment.subscriptionStatus.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-xs font-mono">
                            {payment.stripeCustomerId?.slice(0, 10)}...
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {payment.subscriptionEndAt
                              ? new Date(
                                  payment.subscriptionEndAt,
                                ).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {(page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, stats?.total || 0)} of{" "}
                  {stats?.total || 0} subscriptions
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No payments found</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export { PaymentsManager };
