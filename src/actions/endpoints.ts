const baseURL = process.env.BASE_URL;
const SCANNER_BASE_URL =
  process.env.NEXT_PUBLIC_SCANNER_API || "http://localhost:8000";

const API_ENDPOINTS = {
  registration_endpoint: "/api/mvs/registration",
  usernameuniqueness: "/api/mvs/usernameisunique",
  verificationCode: "/api/mvs/verify-code",
  forgotPasswordRequestCode: "/api/mvs/forgot-password/request-code",
  forgotPasswordReset: "/api/mvs/forgot-password/reset-password",
  imageUploadToServer: "/api/upload/image",
  gettingCurrentUserDets: "/api/mvs/me",
  dashboard: "/api/dashboard",
  account: "/api/account",
  accountDetails: "/api/account/account-details",
  scans: "/api/scans",
  scansDemo: "/api/scans/demo",
  getProfilePicture: "/api/get-profile-image",
  getUserAccountInformation: "/api/account/account-details",
  changeProfilePassword: "/api/mvs/forgot-password",
  getAdminTotalUsersCount: "/api/user-analytics/total-count",

  // Scanner endpoints
  scanner_scan_model: `${SCANNER_BASE_URL}/api/v1/scan/scan_model`,
  scanner_scan_zip: `${SCANNER_BASE_URL}/api/v1/scan/scan_zip`,
  scanner_scan_github: `${SCANNER_BASE_URL}/api/v1/scan/scan_github`,
  scanner_health: `${SCANNER_BASE_URL}/api/v1/scan/health`,
};

export { API_ENDPOINTS, SCANNER_BASE_URL };
