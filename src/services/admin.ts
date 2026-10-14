import axios from "axios";

const API = axios.create({
  baseURL: "/api/admin",
});

// Dashboard
export const getDashboardOverview = () => API.get("/");

// Users
export const getUsers = (page: number, limit: number, search: string) =>
  API.get("/users", {
    params: { page, limit, search },
  });

export const getUserDetails = (userId: string) => API.get(`/users/${userId}`);

export const updateUser = (
  userId: string,
  userData: any,
  accountData: any
) =>
  API.put("/users", {
    userId,
    userData,
    accountData,
  });

export const updateUserLimits = (userId: string, limits: any) =>
  API.put(`/users/${userId}`, limits);

export const deleteUser = (userId: string) =>
  API.delete("/users", {
    params: { userId },
  });

// Payments
export const getPayments = (page: number, limit: number, status?: string) =>
  API.get("/payments", {
    params: {
      page,
      limit,
      ...(status && { status }),
    },
  });

// Analytics
export const getAnalytics = () => API.get("/analytics");

// Charts
export const getChartData = (type: string, days: number) =>
  API.get("/charts", {
    params: { type, days },
  });

export const getScansTrend = (days: number) =>
  getChartData("scans-trend", days);

export const getSeverityDistribution = (days: number) =>
  getChartData("severity-distribution", days);

export const getUserGrowth = (days: number) =>
  getChartData("user-growth", days);

export const getScanStatus = (days: number) =>
  getChartData("scan-status", days);
