"use client";

import { Box } from "@radix-ui/themes";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SubscriptionPage() {
  const [account, setAccount] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const response = await fetch("/api/account");
      const result = await response.json();
      if (result.success) {
        setAccount(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch account data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box>
        <Box className="w-full px-8 py-8">
          <div className="text-center text-gray-500">Loading...</div>
        </Box>
      </Box>
    );
  }

  if (!account) {
    return (
      <Box>
        <Box className="w-full px-8 py-8">
          <div className="text-center text-red-500">
            Failed to load account data
          </div>
        </Box>
      </Box>
    );
  }

  const reportsUsed = account.reportsUsed || 0;
  const reportsLimit = account.reportsLimit || 3;
  const usagePercent = Math.round((reportsUsed / reportsLimit) * 100);
  const isProPlan = account.plan === "pro";

  return (
    <Box>
      <Box className="w-full px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            Subscription & Usage
          </h1>
          <p className="text-gray-600">
            Manage your plan and view your usage statistics
          </p>
        </div>

        <div className="max-w-3xl">
          {/* Current Plan Card */}
          <div className="bg-white border border-gray-300 rounded-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-black">
                  {isProPlan ? "Pro Plan" : "Free Plan"}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {isProPlan
                    ? "Full access to all features"
                    : "Limited access to scanning features"}
                </p>
              </div>
              <div
                className={`px-6 py-2 rounded-full font-semibold text-sm ${
                  isProPlan
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {isProPlan ? "Active" : "Current"}
              </div>
            </div>

            {/* Plan Features */}
            <div className="space-y-3 mb-8 pb-8 border-b border-gray-200">
              {isProPlan ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-semibold">
                      Included
                    </span>
                    <span className="text-gray-700">Unlimited code scans</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-semibold">
                      Included
                    </span>
                    <span className="text-gray-700">
                      Advanced vulnerability detection
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-semibold">
                      Included
                    </span>
                    <span className="text-gray-700">Priority support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-semibold">
                      Included
                    </span>
                    <span className="text-gray-700">API access</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-semibold">
                      Included
                    </span>
                    <span className="text-gray-700">3 scans per month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-semibold">
                      Not included
                    </span>
                    <span className="text-gray-500">
                      Advanced vulnerability detection
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-semibold">
                      Not included
                    </span>
                    <span className="text-gray-500">Priority support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-semibold">
                      Not included
                    </span>
                    <span className="text-gray-500">API access</span>
                  </div>
                </>
              )}
            </div>

            {isProPlan && account.trialEndDate && (
              <div className="text-sm text-gray-600">
                <p>
                  Trial expires on:{" "}
                  <span className="font-semibold text-black">
                    {new Date(account.trialEndDate).toLocaleDateString()}
                  </span>
                </p>
              </div>
            )}

            {!isProPlan && (
              <button className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition">
                Upgrade to Pro
              </button>
            )}
          </div>

          {/* Usage Statistics */}
          <div className="bg-white border border-gray-300 rounded-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-black mb-6">Scan Usage</h3>

            {/* Usage Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Scans Used</p>
                <p className="text-3xl font-bold text-black">{reportsUsed}</p>
                <p className="text-xs text-gray-500 mt-2">
                  of {reportsLimit} available
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Remaining</p>
                <p className="text-3xl font-bold text-black">
                  {Math.max(0, reportsLimit - reportsUsed)}
                </p>
                <p className="text-xs text-gray-500 mt-2">scans this period</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  Monthly Usage
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {usagePercent}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    usagePercent >= 90
                      ? "bg-red-600"
                      : usagePercent >= 70
                        ? "bg-yellow-600"
                        : "bg-green-600"
                  }`}
                  style={{ width: `${usagePercent}%` }}
                ></div>
              </div>
            </div>

            {/* Usage Timeline */}
            <div className="text-sm text-gray-600">
              <p className="mb-3">
                Resets on:{" "}
                <span className="font-semibold text-black">
                  {new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    1,
                  ).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>

          {/* Subscription Settings */}
          <div className="bg-white border border-gray-300 rounded-lg p-8">
            <h3 className="text-xl font-bold text-black mb-6">
              Subscription Settings
            </h3>

            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <span className="font-medium text-black">Payment Method</span>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your billing information
                </p>
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <span className="font-medium text-black">Billing History</span>
                <p className="text-sm text-gray-600 mt-1">
                  View invoices and payment history
                </p>
              </button>
              {!isProPlan && (
                <Link
                  href="/checkout"
                  className="block w-full text-center px-4 py-3 border border-black rounded-lg hover:bg-gray-100 transition font-semibold text-black"
                >
                  Go to Checkout
                </Link>
              )}
              {isProPlan && (
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-red-600">
                  <span className="font-medium">Cancel Subscription</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Downgrade to the free plan
                  </p>
                </button>
              )}
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
}
