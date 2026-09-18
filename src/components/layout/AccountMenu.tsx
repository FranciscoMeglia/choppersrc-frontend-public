"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { login, logout } from "@/lib/auth/client";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import type { AuthUser } from "@/types/auth";

function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase());
  return initials.join("");
}

export function AccountMenu({ user }: { user: AuthUser | null }) {
  const t = useTranslations("Header");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      setOpen(false);
      setEmail("");
      setPassword("");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("loginError"));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 p-2 text-ink hover:text-primary"
        aria-label={user ? t("myAccount") : t("login")}
        aria-expanded={open}
      >
        {user && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-heading text-[11px] font-bold tracking-wide text-white shadow-sm">
            {getInitials(user.name)}
          </span>
        )}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-6 w-6"
        >
          <circle cx="12" cy="8" r="4" />
          <path
            d="M4 20c1.4-4.2 4.8-6 8-6s6.6 1.8 8 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 z-20 mt-2 w-64 rounded border border-ink/10 bg-background p-4 shadow-lg">
          {user ? (
            <div className="flex flex-col gap-3 text-sm">
              <p className="truncate font-medium">{user.name}</p>
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="hover:text-primary"
              >
                {t("myAccount")}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-left text-ink/60 hover:text-primary"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder={t("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  type="password"
                  placeholder={t("password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="rounded border border-ink/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <Link
                  href="/forgot-password"
                  onClick={() => setOpen(false)}
                  className="self-start text-xs text-ink/60 hover:text-primary"
                >
                  {t("forgotPassword")}
                </Link>
                {error && <p className="text-xs text-primary">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center"
                >
                  {loading ? t("loggingIn") : t("submit")}
                </Button>
              </form>
              <p className="mt-3 text-center text-xs text-ink/60">
                {t("noAccount")}{" "}
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="font-medium text-primary hover:underline"
                >
                  {t("register")}
                </Link>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
