import {
  ADMIN_DASHBOARD,
  ADMIN_MANAGE_USERS,
  ADMIN_PAYMENTS,
  ADMIN_USER_REPORTS,
  ACCOUNT_SETTINGS,
  DOCS,
  HISTORY,
  PRICING,
  SCANNER,
  SCHEDULE_SCAN,
  SUBSCRIPTION,
  USER_DASHBOARD,
} from "./page-urls";

const USER_HEADER_LINKS = [
  { label: "Scanner Dashboard", href: USER_DASHBOARD },
  { label: "Scans History", href: HISTORY },
  { label: "Scanner", href: SCANNER },
  { label: "Schedule Scan", href: SCHEDULE_SCAN },
  { label: "Pricing", href: PRICING },
  { label: "Scanner Docs", href: DOCS },
];
const ADMIN_HEADER_LINKS = [
  { label: "Home", href: ADMIN_DASHBOARD },
  { label: "Manage Users", href: ADMIN_MANAGE_USERS },
  { label: "Payments", href: ADMIN_PAYMENTS },
  { label: "Analytics", href: ADMIN_USER_REPORTS },
];

const USER_DROPDOWN = [
  { label: "Settings", href: ACCOUNT_SETTINGS },
  { label: "Subscription", href: SUBSCRIPTION },
];

const ADMIN_DROPDOWN = [];

export interface UserField {
  label: string;
  value: string | number;
}

type UserDetails = {
  email: string;
  persona: string;
  isActive: boolean;
  isUserVerified: boolean;
  createdAt: string | number | Date;
};

type DateLikeValue = string | number | Date | null | undefined;

const GETUSERFIELDS = (user: UserDetails): UserField[] => [
  { label: "Email", value: user.email },
  { label: "Persona", value: user.persona },
  { label: "Active", value: user.isActive ? "Yes" : "No" },
  { label: "Verified", value: user.isUserVerified ? "Yes" : "No" },
  { label: "Created At", value: new Date(user.createdAt).toLocaleString() },
];

const GETUSERACCOUNTDETAILSFIELDS = (
  formatDate: (value: DateLikeValue) => string,
  accountDetailsForUser: {
    plan: string;
    subscriptionStatus: string;
    isTrialActive: boolean;
    trialStartDate: DateLikeValue;
    trialEndDate: DateLikeValue;
    reportsUsed: number;
    reportsLimit: number;
    createdAt: DateLikeValue;
  },
): UserField[] => [
  { label: "Plan", value: accountDetailsForUser.plan },
  {
    label: "Subscription Status",
    value: accountDetailsForUser.subscriptionStatus,
  },
  {
    label: "Trial Active",
    value: accountDetailsForUser.isTrialActive ? "Yes" : "No",
  },
  {
    label: "Trial Start Date",
    value: formatDate(accountDetailsForUser.trialStartDate),
  },
  {
    label: "Trial End Date",
    value: formatDate(accountDetailsForUser.trialEndDate),
  },
  {
    label: "Reports Used",
    value: `${accountDetailsForUser.reportsUsed}`,
  },
  {
    label: "Reports Limit",
    value: `${accountDetailsForUser.reportsLimit}`,
  },
  {
    label: "Account Created At",
    value: formatDate(accountDetailsForUser.createdAt),
  },
];

export {
  USER_HEADER_LINKS,
  ADMIN_HEADER_LINKS,
  USER_DROPDOWN,
  ADMIN_DROPDOWN,
  GETUSERFIELDS,
  GETUSERACCOUNTDETAILSFIELDS,
};
