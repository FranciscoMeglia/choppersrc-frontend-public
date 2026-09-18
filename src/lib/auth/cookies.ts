import "server-only";
import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  sessionCookieOptions,
} from "./constants";

export async function setSessionCookies(
  accessToken: string,
  refreshToken: string,
) {
  const store = await cookies();
  store.set(
    ACCESS_TOKEN_COOKIE,
    accessToken,
    sessionCookieOptions(ACCESS_TOKEN_MAX_AGE),
  );
  store.set(
    REFRESH_TOKEN_COOKIE,
    refreshToken,
    sessionCookieOptions(REFRESH_TOKEN_MAX_AGE),
  );
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
}

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_TOKEN_COOKIE)?.value;
}
