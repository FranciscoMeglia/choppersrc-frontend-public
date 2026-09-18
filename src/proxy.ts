import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  sessionCookieOptions,
} from "@/lib/auth/constants";
import { isJwtExpired } from "@/lib/auth/jwt";
import { refreshTokens } from "@/lib/auth/refreshTokens";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PREFIXES = ["/account", "/checkout"];

function stripLocalePrefix(pathname: string): string {
  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) continue;
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1) || "/";
    }
  }
  return pathname;
}

function localeFromPathname(pathname: string): string {
  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) continue;
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale;
    }
  }
  return routing.defaultLocale;
}

function isProtected(pathname: string): boolean {
  const bare = stripLocalePrefix(pathname);
  return PROTECTED_PREFIXES.some(
    (prefix) => bare === prefix || bare.startsWith(`${prefix}/`),
  );
}

function redirectToLogin(request: NextRequest): NextResponse {
  const locale = localeFromPathname(request.nextUrl.pathname);
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const loginUrl = new URL(`${prefix}/login`, request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  return response;
}

function isAssetPath(pathname: string): boolean {
  return /\.[^/]+$/.test(pathname);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api");
  const baseResponse =
    isApi || isAssetPath(pathname)
      ? NextResponse.next()
      : intlMiddleware(request);

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (accessToken && !isJwtExpired(accessToken)) {
    return baseResponse;
  }

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) {
    return isProtected(pathname) ? redirectToLogin(request) : baseResponse;
  }

  const refreshed = await refreshTokens(refreshToken);
  if (!refreshed) {
    return isProtected(pathname) ? redirectToLogin(request) : baseResponse;
  }

  baseResponse.cookies.set(
    ACCESS_TOKEN_COOKIE,
    refreshed.accessToken,
    sessionCookieOptions(ACCESS_TOKEN_MAX_AGE),
  );
  baseResponse.cookies.set(
    REFRESH_TOKEN_COOKIE,
    refreshed.refreshToken,
    sessionCookieOptions(REFRESH_TOKEN_MAX_AGE),
  );
  return baseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
