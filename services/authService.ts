import { API_BASE_URL, AUTH_ENDPOINTS } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const AUTH_STATE_KEY = "isAuthenticated";
const USER_FLAG_KEY = "userFlag";
const USER_ID_KEY = "userId";

export type LoginResponse = {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  user?: Record<string, unknown>;
  message?: string;
};

export type TherapistRoleData = {
  _id?: string;
  teacherId?: number;
  userId?: number;
  user?: string;
  organizationId?: number;
  organizationAdminId?: number;
  zonalAdminId?: number;
  adminId?: number;
  therapist_category?: string;
  yearsOfExperience?: number;
  phone?: string | null;
  specialization?: string[];
  qualifications?: string[];
  licenseNumber?: string | null;
  languages?: string[];
  cliniqueName?: string | null;
  [key: string]: any;
};

export type Therapist = {
  _id: string;
  userId: number;
  name: string;
  email?: string;
  flag: number;
  status?: number;
  profileImg?: string | null;
  city?: string;
  state?: string;
  pincode?: string;
  address?: string;
  phone?: string;
  country?: string | null;
  roleData?: TherapistRoleData;
  relatedData?: Record<string, any>;
  [key: string]: any;
};

export type AvailabilitySlot = {
  _id: string;
  userId: number;
  date: string;
  time: string;
  isBooked: boolean;
  medium?: "home" | "center" | "online" | "room" | string;
  zoomLink?: string | null;
  zoomMeetingId?: string | null;
};

type GetUsersResponse = {
  success: boolean;
  count: number;
  data: Therapist[];
  message?: string;
};

type GetAvailabilityResponse = {
  success: boolean;
  data: AvailabilitySlot[];
  message?: string;
};

type CreateAppointmentResponse = {
  success: boolean;
  message: string;
  data?: { _id: string; status: string };
};

export type AppointmentTeacher = {
  _id?: string;
  teacherId?: number;
  userId?: number;
  user?: string;
  organizationId?: number | null;
  organizationAdminId?: number | null;
  zonalAdminId?: number | null;
  adminId?: number | null;
  therapist_category?: string;
  yearsOfExperience?: number;
  languages?: string[];
  [key: string]: any;
};

export type AppointmentTeacherUser = {
  _id?: string;
  name?: string;
  email?: string;
  flag?: number;
  status?: number;
  profileImg?: string | null;
  city?: string;
  state?: string;
  pincode?: string;
  address?: string;
  phone?: string | null;
  country?: string | null;
  googleProfile?: {
    name?: string;
    picture?: string;
    email?: string;
  };
  facebookProfile?: {
    name?: string;
    picture?: string;
    email?: string;
  };
  [key: string]: any;
};

export type ChildDetail = {
  _id?: string;
  parentId?: number;
  childName?: string;
  childGender?: string;
  childAge?: number;
  grade?: string;
  familyType?: string;
  language?: string;
  dob?: string;
  childId?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export type Appointment = {
  _id: string;
  parentId: number;
  teacherId: number;
  availabilityId?: string;
  date: string;
  time: string;
  status: string;
  reason?: string | null;
  paymentId?: string | null;
  zoomLink?: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  availability?: AvailabilitySlot | AvailabilitySlot[];
  teacher?: AppointmentTeacher;
  teacherUser?: AppointmentTeacherUser;
  parent?: Record<string, any>;
  parentUser?: Record<string, any>;
  childDetails?: ChildDetail[];
  organization?: Record<string, any>;
  zonalAdmin?: Record<string, any>;
  admin?: Record<string, any>;
  [key: string]: any;
};

type GetAppointmentsResponse = {
  success: boolean;
  message?: string;
  data: Appointment[];
};

export type ParentRegistrationPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  flag: 2 | 4;
  referralCode?: string;
};

export type ChildInformationPayload = {
  parentId: number;
  childName: string;
  childAge: number;
  dob: string;
  childGender: string;
  grade: string;
  familyType: string;
  language: string;
};

type AddChildInformationResponse = {
  success: boolean;
  message?: string;
  data?: ChildInformationPayload & { _id: string; childId: number };
};

async function getStoredToken(key: string) {
  return AsyncStorage.getItem(key);
}

function extractValue(
  payload: Record<string, any> | undefined,
  keys: string[],
) {
  for (const key of keys) {
    const value = key
      .split(".")
      .reduce<any>((acc, part) => acc?.[part], payload);
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

function toFiniteNumber(value: unknown) {
  const numberValue = typeof value === "string" ? Number(value) : value;
  return typeof numberValue === "number" && Number.isFinite(numberValue)
    ? numberValue
    : null;
}

function getUserIdFromToken(token: string | null) {
  if (!token) return null;

  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload || typeof atob !== "function") return null;

    const payload = JSON.parse(
      atob(encodedPayload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as Record<string, unknown>;
    return (
      [payload.userId, payload.parentId, payload.id, payload.sub]
        .map(toFiniteNumber)
        .find((value): value is number => value !== null) || null
    );
  } catch {
    return null;
  }
}

export async function saveAuthTokens(
  accessToken: string,
  refreshToken: string,
) {
  await AsyncStorage.setItem(AUTH_STATE_KEY, "true");

  if (accessToken) {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export async function clearAuthTokens() {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  await AsyncStorage.removeItem(AUTH_STATE_KEY);
  await AsyncStorage.removeItem(USER_FLAG_KEY);
  await AsyncStorage.removeItem(USER_ID_KEY);
}

export async function getAccessToken() {
  return getStoredToken(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken() {
  return getStoredToken(REFRESH_TOKEN_KEY);
}

export async function getLoggedInUserFlag() {
  const storedFlag = await AsyncStorage.getItem(USER_FLAG_KEY);
  const flag = Number(storedFlag);
  return Number.isFinite(flag) ? flag : null;
}

export async function isAuthenticated() {
  const accessToken = await getAccessToken();
  const authState = await AsyncStorage.getItem(AUTH_STATE_KEY);
  return Boolean(accessToken || authState === "true");
}

function extractUserFlag(data: any): number | null {
  const user = data?.data?.user ?? data?.user ?? data?.data ?? data;
  const rawFlag =
    user?.flag ??
    data?.user?.flag ??
    data?.data?.user?.flag ??
    data?.data?.flag ??
    data?.flag ??
    data?.result?.user?.flag;
  return toFiniteNumber(rawFlag);
}

export async function loginUser(email: string, password: string) {
  await clearAuthTokens();
  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.login}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Login failed");
  }

  const userFlag = extractUserFlag(data);

  if (userFlag !== 2 && userFlag !== 4) {
    throw new Error("You are not register as Parent.");
  }

  const accessToken = extractValue(data as Record<string, any>, [
    "accessToken",
    "access_token",
    "token",
    "authToken",
    "data.accessToken",
    "data.access_token",
    "data.token",
    "result.accessToken",
    "result.token",
  ]);

  const refreshToken = extractValue(data as Record<string, any>, [
    "refreshToken",
    "refresh_token",
    "refreshTokenValue",
    "data.refreshToken",
    "data.refresh_token",
    "result.refreshToken",
  ]);

  if (
    response.ok &&
    (accessToken || refreshToken || data?.user || data?.data?.user || data?.message)
  ) {
    await saveAuthTokens(accessToken || "", refreshToken || "");
  }

  if (typeof userFlag === "number") {
    await AsyncStorage.setItem(USER_FLAG_KEY, String(userFlag));
  }

  const userId = [
    data?.user?.userId,
    data?.user?.id,
    data?.user?._id,
    data?.data?.user?.userId,
    data?.data?.user?.id,
    data?.data?.user?._id,
    data?.data?.parent?.userId,
    data?.data?.parentId,
    data?.data?.userId,
    data?.userId,
    data?.result?.user?.userId,
  ]
    .map(toFiniteNumber)
    .find((value): value is number => value !== null);

  if (typeof userId === "number") {
    await AsyncStorage.setItem(USER_ID_KEY, String(userId));
  }

  return data as LoginResponse;
}

/**
 * Exchanges a Google-issued OpenID Connect ID token for an AsDimo session.
 * The API verifies the token and returns the same session fields as password login.
 */
export async function googleLogin(
  idToken: string,
  userData?: Pick<ParentRegistrationPayload, "flag"> | { flag?: number },
) {
  await clearAuthTokens();
  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.googleLogin}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken, ...(userData || {}) }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Google authentication failed");
  }

  const userFlag = extractUserFlag(data) ?? userData?.flag;

  if (userFlag !== 2 && userFlag !== 4) {
    throw new Error("You are not register as Parent.");
  }

  const accessToken = extractValue(data as Record<string, any>, [
    "accessToken",
    "token",
    "data.accessToken",
    "data.token",
  ]);
  const refreshToken = extractValue(data as Record<string, any>, [
    "refreshToken",
    "data.refreshToken",
  ]);

  if (!accessToken) {
    throw new Error("Google authentication did not return an access token");
  }

  await saveAuthTokens(accessToken, refreshToken || "");

  if (typeof userFlag === "number") {
    await AsyncStorage.setItem(USER_FLAG_KEY, String(userFlag));
  }

  const user = data?.data?.user ?? data?.user;
  const userId = [user?.userId, user?.id, user?._id, data?.data?.userId, data?.userId]
    .map(toFiniteNumber)
    .find((value): value is number => value !== null);
  if (userId !== undefined && userId !== null) {
    await AsyncStorage.setItem(USER_ID_KEY, String(userId));
  }

  return data as LoginResponse;
}

//////////////// google signup /////////////////////

export async function googleSignup(
  idToken: string,
  userData?: Pick<ParentRegistrationPayload, "flag"> | { flag?: number },
) {
  return googleLogin(idToken, userData);
}

//////////////// google signup /////////////////////

//////////////// google signup /////////////////////

/**
 * Exchanges a Facebook OAuth access token for an AsDimo session.
 * The API validates the Facebook token before creating the app session.
 */
export async function facebookLogin(facebookAccessToken: string) {
  await clearAuthTokens();
  const response = await fetch(
    `${API_BASE_URL}${AUTH_ENDPOINTS.facebookLogin}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken: facebookAccessToken }),
    },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Facebook login failed");
  }

  const userFlag = extractUserFlag(data);

  if (userFlag !== 2 && userFlag !== 4) {
    throw new Error("You are not register as Parent.");
  }

  const accessToken = extractValue(data as Record<string, any>, [
    "accessToken",
    "token",
    "data.accessToken",
    "data.token",
  ]);
  const refreshToken = extractValue(data as Record<string, any>, [
    "refreshToken",
    "data.refreshToken",
  ]);

  if (!accessToken) {
    throw new Error("Facebook login did not return an access token");
  }

  await saveAuthTokens(accessToken, refreshToken || "");

  if (typeof userFlag === "number") {
    await AsyncStorage.setItem(USER_FLAG_KEY, String(userFlag));
  }

  const user = data?.data?.user ?? data?.user;
  const userId = [user?.userId, user?.id, user?._id, data?.data?.userId, data?.userId]
    .map(toFiniteNumber)
    .find((value): value is number => value !== null);
  if (userId !== undefined && userId !== null) {
    await AsyncStorage.setItem(USER_ID_KEY, String(userId));
  }

  return data as LoginResponse;
}

//////////////// facebook signup /////////////////////
export async function facebookSignup(
  facebookAccessToken: string,
  userData: Pick<ParentRegistrationPayload, "flag">,
) {
  await clearAuthTokens();
  const response = await fetch(
    `${API_BASE_URL}${AUTH_ENDPOINTS.facebookSignup}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken: facebookAccessToken, ...userData }),
    },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Facebook signup failed");
  }

  const accessToken = extractValue(data as Record<string, any>, [
    "accessToken",
    "token",
    "data.accessToken",
    "data.token",
  ]);
  const refreshToken = extractValue(data as Record<string, any>, [
    "refreshToken",
    "data.refreshToken",
  ]);

  if (!accessToken) {
    throw new Error("Facebook signup did not return an access token");
  }

  await saveAuthTokens(accessToken, refreshToken || "");

  const userFlag = extractUserFlag(data) ?? userData.flag;
  if (userFlag !== null && typeof userFlag === "number") {
    await AsyncStorage.setItem(USER_FLAG_KEY, String(userFlag));
  }

  const user = data?.data?.user ?? data?.user;
  const userId = [user?.userId, user?.id, user?._id, data?.data?.userId, data?.userId]
    .map(toFiniteNumber)
    .find((value): value is number => value !== null);
  if (userId !== undefined && userId !== null) {
    await AsyncStorage.setItem(USER_ID_KEY, String(userId));
  }

  return data as LoginResponse;
}
//////////////// facebook signup /////////////////////

async function postAuthEndpoint<T>(
  endpoint: string,
  body: Record<string, unknown>,
  includeAccessToken = false,
) {
  const accessToken = includeAccessToken ? await getAccessToken() : null;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Request failed. Please try again.");
  }

  return data as T;
}

async function getAuthEndpoint<T>(
  endpoint: string,
  includeAccessToken = false,
) {
  const accessToken = includeAccessToken ? await getAccessToken() : null;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Request failed. Please try again.");
  }

  return data as T;
}

async function patchAuthEndpoint<T>(
  endpoint: string,
  body: Record<string, unknown>,
  includeAccessToken = false,
) {
  const accessToken = includeAccessToken ? await getAccessToken() : null;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Request failed. Please try again.");
  }

  return data as T;
}

export function verifySignupEmail(email: string) {
  return postAuthEndpoint<{ message?: string }>(AUTH_ENDPOINTS.verifyEmail, {
    email,
  });
}

export function validateSignupOtp(email: string, otp: string) {
  return postAuthEndpoint<{ message?: string; data?: { userId?: string } }>(
    AUTH_ENDPOINTS.validateOtp,
    { email, otp },
  );
}

export function registerParent(payload: ParentRegistrationPayload) {
  return postAuthEndpoint<{ message?: string }>(
    AUTH_ENDPOINTS.register,
    payload,
    true,
  );
}

export async function getTherapists() {
  const loggedInUserFlag = await getLoggedInUserFlag();

  if (loggedInUserFlag !== 4 && loggedInUserFlag !== 2) {
    throw new Error("Only parent accounts can view therapists.");
  }

  if (loggedInUserFlag === 2) {
    const response = await postAuthEndpoint<GetUsersResponse>(
      AUTH_ENDPOINTS.getAllUsers,
      { flag: 3 },
      true,
    );

    return response.data || [];
  } else {
    const response = await postAuthEndpoint<GetUsersResponse>(
      AUTH_ENDPOINTS.getAllUsers,
      { flag: 5 },
      true,
    );

    return response.data || [];
  }
}

export function addChildInformation(payload: ChildInformationPayload) {
  return postAuthEndpoint<AddChildInformationResponse>(
    AUTH_ENDPOINTS.addChildInformation,
    payload,
    true,
  );
}

export async function getLoggedInUserId() {
  const storedUserId = await AsyncStorage.getItem(USER_ID_KEY);
  const userId = toFiniteNumber(storedUserId);
  if (userId !== null) return userId;

  const tokenUserId = getUserIdFromToken(await getAccessToken());
  if (tokenUserId !== null) {
    await AsyncStorage.setItem(USER_ID_KEY, String(tokenUserId));
  }

  return tokenUserId;
}

export async function getUserById(userId: number) {
  const response = await postAuthEndpoint<{
    success: boolean;
    data: Therapist;
    message?: string;
  }>(AUTH_ENDPOINTS.getAllUsersById, { userId }, true);

  return response.data;
}

export async function getTherapistAvailability(therapistId: number) {
  const response = await postAuthEndpoint<GetAvailabilityResponse>(
    AUTH_ENDPOINTS.getTherapistAvailability,
    { therapistId },
    true,
  );

  return response.data || [];
}

export function createAppointment(payload: {
  teacherId: number;
  date: string;
  time: string;
  parentId: number;
  paymentId: string;
}) {
  return postAuthEndpoint<CreateAppointmentResponse>(
    AUTH_ENDPOINTS.appointments,
    payload,
    true,
  );
}

export async function getParentAppointments(parentId: number) {
  const response = await postAuthEndpoint<GetAppointmentsResponse>(
    AUTH_ENDPOINTS.getAppointmentsById,
    { parentId },
    true,
  );

  return response.data || [];
}

export async function getAppointmentsForParent(parentId: number) {
  const response = await postAuthEndpoint<GetAppointmentsResponse>(
    AUTH_ENDPOINTS.getAppointmentsForParent,
    { parentId },
    true,
  );

  return response.data || [];
}

export async function getAppointmentById(appointmentId: string) {
  const response = await getAuthEndpoint<{
    success: boolean;
    message?: string;
    data: Appointment;
  }>(`/appointments/${appointmentId}`, true);

  return response.data;
}

export async function getTeacherAvailableSlots(teacherUserId: number | string) {
  const response = await getAuthEndpoint<{
    success: boolean;
    data: AvailabilitySlot[];
    message?: string;
  }>(`/appointments/available-slots/${teacherUserId}`, true);

  return response.data || [];
}

export async function cancelAppointment(appointmentId: string, reason: string) {
  const response = await patchAuthEndpoint<{
    success: boolean;
    message?: string;
    data?: any;
  }>(`/appointments/cancel/${appointmentId}`, { reason: reason.trim() }, true);

  return response;
}

export async function rescheduleAppointment(
  appointmentId: string,
  payload: { date: string; time: string; reason: string },
) {
  const response = await patchAuthEndpoint<{
    success: boolean;
    message?: string;
    data?: any;
  }>(
    `/appointments/reschedule/${appointmentId}`,
    {
      date: payload.date,
      time: payload.time,
      reason: payload.reason.trim(),
    },
    true,
  );

  return response;
}

export async function refreshToken() {
  const refreshTokenValue = await getRefreshToken();

  if (!refreshTokenValue) {
    throw new Error("No refresh token found");
  }

  const response = await fetch(
    `${API_BASE_URL}${AUTH_ENDPOINTS.refreshToken}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Token refresh failed");
  }

  const accessToken = extractValue(data as Record<string, any>, [
    "accessToken",
    "access_token",
    "token",
    "authToken",
    "data.accessToken",
    "data.access_token",
    "data.token",
    "result.accessToken",
    "result.token",
  ]);

  const newRefreshToken = extractValue(data as Record<string, any>, [
    "refreshToken",
    "refresh_token",
    "refreshTokenValue",
    "data.refreshToken",
    "data.refresh_token",
    "result.refreshToken",
  ]);

  if (response.ok && (accessToken || newRefreshToken)) {
    await saveAuthTokens(accessToken || "", newRefreshToken || "");
  }

  return data as LoginResponse;
}

export async function logoutUser(customRefreshToken?: string) {
  try {
    const accessToken = await getAccessToken();
    const refreshToken = customRefreshToken || (await getRefreshToken());

    if (accessToken) {
      await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.logout}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          refreshToken: refreshToken || null,
        }),
      }).catch((error) => {
        console.warn("Logout API call error:", error);
      });
    }
  } catch (error) {
    console.warn("Logout error:", error);
  } finally {
    await clearAuthTokens();
  }
}

