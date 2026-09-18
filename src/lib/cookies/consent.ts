export type CookieConsent = "accepted" | "rejected";

const STORAGE_KEY = "choppersrc_cookie_consent";

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeConsent(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function readStoredConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

export function writeStoredConsent(consent: CookieConsent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, consent);
  } catch {
  }
  listeners.forEach((listener) => listener());
}
