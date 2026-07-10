import { API_BASE_URL, AUTH_ENDPOINTS } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const AUTH_STATE_KEY = "isAuthenticated";

export type LoginResponse = {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  user?: Record<string, unknown>;
  message?: string;
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
}

export async function getAccessToken() {
  return getStoredToken(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken() {
  return getStoredToken(REFRESH_TOKEN_KEY);
}

export async function isAuthenticated() {
  const accessToken = await getAccessToken();
  const authState = await AsyncStorage.getItem(AUTH_STATE_KEY);
  return Boolean(accessToken || authState === "true");
}

export async function loginUser(email: string, password: string) {
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
    (accessToken || refreshToken || data?.user || data?.message)
  ) {
    await saveAuthTokens(accessToken || "", refreshToken || "");
  }

  return data as LoginResponse;
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
