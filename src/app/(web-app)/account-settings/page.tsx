"use client";

import { useState, useEffect } from "react";
import { Box } from "@radix-ui/themes";
import Link from "next/link";
import { AccountDetailsData, IUSERDETSRESPONSE } from "@/types";
import { API_ENDPOINTS } from "@/actions";

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [user, setUser] = useState<IUSERDETSRESPONSE | null>(null);
  const [account, setAccount] = useState<AccountDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<{ fullName: string }>({
    fullName: "",
  });
  const [message, setMessage] = useState("");

  const generalEndpoints = [
    { label: "Current user", href: API_ENDPOINTS.gettingCurrentUserDets },
    { label: "Dashboard", href: API_ENDPOINTS.dashboard },
    { label: "Scanner health", href: API_ENDPOINTS.scanner_health },
    { label: "Scans", href: API_ENDPOINTS.scans },
  ];

  useEffect(() => {
    fetchUserData();
    fetchAccountData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.gettingCurrentUserDets);
      const result = await response.json();
      if (result.success) {
        setUser(result.data);
        setFormData({ fullName: result.data.fullName });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchAccountData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.accountDetails);
      const result = await response.json();
      if (result.success) {
        setAccount(result.data);
      } else {
        setAccount(null);
      }
    } catch (error) {
      console.error("Failed to fetch account data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        setMessage("Profile updated successfully");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage("Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    const currentPassword = (
      document.getElementById("current-password") as HTMLInputElement
    )?.value;
    const newPassword = (
      document.getElementById("new-password") as HTMLInputElement
    )?.value;
    const confirmPassword = (
      document.getElementById("confirm-password") as HTMLInputElement
    )?.value;

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const result = await response.json();
      if (result.success) {
        setMessage("Password changed successfully");
        setTimeout(() => setMessage(""), 3000);
        (
          document.getElementById("current-password") as HTMLInputElement
        ).value = "";
        (document.getElementById("new-password") as HTMLInputElement).value =
          "";
        (
          document.getElementById("confirm-password") as HTMLInputElement
        ).value = "";
      } else {
        setMessage(result.error || "Failed to change password");
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      setMessage("Failed to change password");
    }
  };

  return (
    <Box>
      <Box className="w-full bg-white px-8 py-8 text-black">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-black bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.05)]">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-600">
              Account Settings
            </p>
            <h1 className="mt-2 text-4xl font-bold text-black mb-2">
              Manage your profile, subscription, and live endpoints
            </h1>
            <p className="text-gray-600">
              Clean monochrome settings with live account data, API shortcuts,
              and plan usage.
            </p>
          </div>

          <div className="rounded-3xl border border-black bg-black p-6 text-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full border border-white bg-white flex items-center justify-center">
                {user?.profilePicture?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.profilePicture.url}
                    alt={`${user.username || "User"} profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-black">
                    {user?.fullName?.charAt(0)?.toUpperCase() ||
                      user?.username?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gray-300">
                  Current user
                </p>
                <p className="mt-1 text-xl font-bold">
                  {user?.fullName || user?.username || "Loading..."}
                </p>
                <p className="text-sm text-gray-300">
                  {user?.email || "Fetching current user from the API..."}
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded border border-white/30 p-3">
                <p className="text-gray-300">Plan</p>
                <p className="mt-1 font-semibold uppercase">
                  {account?.plan || "free"}
                </p>
              </div>
              <div className="rounded border border-white/30 p-3">
                <p className="text-gray-300">ZIP scans used</p>
                <p className="mt-1 font-semibold">
                  {account?.reportsUsed || 0}/{account?.reportsLimit || 3}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-gray-300">
          {[
            { id: "general", label: "General" },
            { id: "security", label: "Security" },
            { id: "billing", label: "Billing" },
            { id: "subscription", label: "Subscription" },
            { id: "api", label: "API Keys" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-4 font-medium transition border-b-2 ${
                activeTab === tab.id
                  ? "text-black border-b-black"
                  : "text-gray-600 border-b-transparent hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === "general" && (
          <div className="max-w-2xl">
            <div className="bg-white border border-gray-300 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-6">
                General Settings
              </h2>

              {message && (
                <div
                  className={`p-4 rounded-lg mb-6 ${message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {message}
                </div>
              )}

              {isLoading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : user ? (
                <div className="space-y-6">
                  {/* Profile Photo */}
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-300">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
                      {user.profilePicture?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.profilePicture.url}
                          alt={`${user.username} profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-black">
                          {user.fullName?.charAt(0)?.toUpperCase() ||
                            user.username?.charAt(0)?.toUpperCase() ||
                            "U"}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current user</p>
                      <p className="text-base font-semibold text-black">
                        {user.fullName || user.username}
                      </p>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      Verified account
                    </p>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={user.username}
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                    />
                  </div>

                  {/* Email Notifications */}
                  <div className="pt-6 border-t border-gray-300">
                    <h3 className="text-lg font-bold text-black mb-4">
                      Email Notifications
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">
                          Scan completion notifications
                        </span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">Security alerts</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-gray-700">
                          Product updates and news
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSaveProfile}
                    className="w-full bg-black text-white py-3 font-semibold rounded-lg hover:bg-gray-800 transition"
                  >
                    Save Changes
                  </button>

                  <div className="pt-6 border-t border-gray-300">
                    <h3 className="text-lg font-bold text-black mb-4">
                      General Endpoints
                    </h3>
                    <div className="grid gap-3">
                      {generalEndpoints.map((endpoint) => (
                        <div
                          key={endpoint.href}
                          className="rounded-lg border border-gray-300 bg-gray-50 p-4"
                        >
                          <p className="text-sm font-semibold text-black">
                            {endpoint.label}
                          </p>
                          <p className="mt-1 break-all text-xs text-gray-600">
                            {endpoint.href}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-red-500">
                  Failed to load user data
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <div className="max-w-2xl">
            <div className="bg-white border border-gray-300 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-6">
                Security Settings
              </h2>

              {message && (
                <div
                  className={`p-4 rounded-lg mb-6 ${message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {message}
                </div>
              )}

              <div className="space-y-8">
                {/* Change Password */}
                <div>
                  <h3 className="text-lg font-bold text-black mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          id="current-password"
                          type={passwordVisible ? "text" : "password"}
                          placeholder="••••••••"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          className="absolute right-3 top-2.5 text-gray-600 hover:text-black"
                        >
                          {passwordVisible ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="new-password"
                          type={newPasswordVisible ? "text" : "password"}
                          placeholder="••••••••"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setNewPasswordVisible(!newPasswordVisible)
                          }
                          className="absolute right-3 top-2.5 text-gray-600 hover:text-black"
                        >
                          {newPasswordVisible ? "Hide" : "Show"}
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Minimum 8 characters
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Confirm New Password
                      </label>
                      <input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleChangePassword}
                      className="w-full bg-black text-white py-3 font-semibold rounded-lg hover:bg-gray-800 transition"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="border-t border-gray-300 pt-8">
                  <h3 className="text-lg font-bold text-black mb-4">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add an extra layer of security to your account by enabling
                    two-factor authentication.
                  </p>
                  <button className="px-6 py-2 border-2 border-black text-black font-semibold rounded-lg hover:bg-gray-100 transition">
                    Enable 2FA
                  </button>
                </div>

                {/* Active Sessions */}
                <div className="border-t border-gray-300 pt-8">
                  <h3 className="text-lg font-bold text-black mb-4">
                    Active Sessions
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You have 1 active session
                  </p>
                  <div className="bg-gray-50 border border-gray-300 rounded p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-black">This Browser</p>
                      <p className="text-sm text-gray-600">
                        Last active: Just now
                      </p>
                    </div>
                    <button className="text-red-600 hover:text-red-800 font-medium text-sm">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Settings */}
        {activeTab === "billing" && (
          <div className="max-w-2xl">
            <div className="bg-white border border-gray-300 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-6">
                Billing & Subscription
              </h2>

              {isLoading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : account ? (
                <div className="space-y-8">
                  {/* Current Plan */}
                  <div>
                    <h3 className="text-lg font-bold text-black mb-4">
                      Current Plan
                    </h3>
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-2xl font-bold text-black">
                            {account.plan === "pro" ? "Pro Plan" : "Free Plan"}
                          </p>
                          <p className="text-gray-600">
                            {account.plan === "pro" &&
                            account.reportsLimit >= 999999
                              ? "Unlimited scans per month"
                              : `${account.reportsLimit || 3} scans per month`}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded">
                          Active
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Scans Used: {account.reportsUsed || 0}/
                        {account.reportsLimit || 3}
                      </p>
                      <div className="w-full bg-gray-200 rounded h-2 mb-4">
                        <div
                          className="bg-black h-2 rounded"
                          style={{
                            width: `${Math.round(
                              ((account.reportsUsed || 0) /
                                (account.reportsLimit || 3)) *
                                100,
                            )}%`,
                          }}
                        ></div>
                      </div>
                      {account.plan !== "pro" && (
                        <Link
                          href="/checkout"
                          className="inline-flex px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                        >
                          Upgrade to Pro
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="border-t border-gray-300 pt-8">
                    <h3 className="text-lg font-bold text-black mb-4">
                      Payment Method
                    </h3>
                    <p className="text-gray-600 mb-4">
                      No payment method on file
                    </p>
                    <button className="px-6 py-2 border-2 border-black text-black font-semibold rounded-lg hover:bg-gray-100 transition">
                      Add Payment Method
                    </button>
                  </div>

                  {/* Billing History */}
                  <div className="border-t border-gray-300 pt-8">
                    <h3 className="text-lg font-bold text-black mb-4">
                      Billing History
                    </h3>
                    <p className="text-gray-600">No invoices yet</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-red-500">
                  Failed to load billing data
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === "subscription" && (
          <div className="max-w-2xl">
            <div className="bg-white border border-gray-300 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-6">
                Subscription & Usage
              </h2>
              {isLoading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : account ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-black mb-4">
                      Current Plan
                    </h3>
                    <p className="text-2xl font-bold text-black mb-2">
                      {account.plan === "pro" ? "Pro Plan" : "Free Plan"}
                    </p>
                    <p className="text-gray-600 mb-6">
                      {account.plan === "pro"
                        ? "You have full access to all scanning features"
                        : `You have ${account.reportsLimit || 3} scans available per month`}
                    </p>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          Monthly Usage
                        </span>
                        <span className="text-sm font-semibold text-gray-700">
                          {Math.round(
                            ((account.reportsUsed || 0) /
                              (account.reportsLimit || 3)) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            Math.round(
                              ((account.reportsUsed || 0) /
                                (account.reportsLimit || 3)) *
                                100,
                            ) >= 90
                              ? "bg-red-600"
                              : Math.round(
                                    ((account.reportsUsed || 0) /
                                      (account.reportsLimit || 3)) *
                                      100,
                                  ) >= 70
                                ? "bg-yellow-600"
                                : "bg-green-600"
                          }`}
                          style={{
                            width: `${Math.round(
                              ((account.reportsUsed || 0) /
                                (account.reportsLimit || 3)) *
                                100,
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {account.reportsUsed || 0} of {account.reportsLimit || 3}{" "}
                      scans used
                    </p>
                  </div>
                  <a
                    href="/account-settings/subscription"
                    className="w-full bg-black text-white py-3 font-semibold rounded-lg hover:bg-gray-800 transition text-center block"
                  >
                    View Detailed Subscription Info
                  </a>
                </div>
              ) : (
                <div className="text-center text-red-500">
                  Failed to load subscription data
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === "api" && (
          <div className="max-w-2xl">
            <div className="bg-white border border-gray-300 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-6">API Keys</h2>

              <div className="space-y-4 mb-6">
                <p className="text-gray-600">
                  API keys allow you to access the MCP Taint Analyzer
                  programmatically.
                </p>
                <button className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition">
                  Generate New API Key
                </button>
              </div>

              <div className="border-t border-gray-300 pt-6">
                <p className="text-gray-600 text-center py-8">
                  No API keys yet
                </p>
              </div>
            </div>
          </div>
        )}
      </Box>
    </Box>
  );
}
