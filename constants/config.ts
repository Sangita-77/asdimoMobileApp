export const API_BASE_URL =
  "https://dreamgroupsindia.com/dev/asDimoBackend/api";

export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  refreshToken: "/auth/refresh-token",
  verifyEmail: "/auth/send-email-otp",
  validateOtp: "/auth/validate-email-otp",
  register: "/auth/register",
} as const;
