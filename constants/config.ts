export const API_BASE_URL =
  "https://dreamgroupsindia.com/dev/asDimoBackend/api";

// export const API_BASE_URL =
// "http://localhost:4000/api";

export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  googleLogin: "/auth/googleLogin",
  facebookLogin: "/auth/facebookLogin",
  googleSignup: "/auth/googleSignup",
  facebookSignup: "/auth/facebookSignup",
  refreshToken: "/auth/refresh-token",
  verifyEmail: "/auth/send-email-otp",
  validateOtp: "/auth/validate-email-otp",
  register: "/auth/register",
  addChildInformation: "/auth/add-child-information",
  getAllUsers: "/auth/getAllUsers",
  getTherapistAvailability: "/therapists/get_availability",
  appointments: "/appointments",
  getAppointmentsById: "/appointments/getAppointmentsById",
} as const;
