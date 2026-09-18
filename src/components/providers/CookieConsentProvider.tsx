"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  readStoredConsent,
  writeStoredConsent,
  subscribeConsent,
  type CookieConsent,
} from "@/lib/cookies/consent";

interface CookieConsentContextValue {
  consent: CookieConsent | null;
  accept: () => void;
  reject: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

function getServerSnapshot() {
  return null;
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const consent = useSyncExternalStore(
    subscribeConsent,
    readStoredConsent,
    getServerSnapshot,
  );

  function accept() {
    writeStoredConsent("accepted");
  }

  function reject() {
    writeStoredConsent("rejected");
  }

  return (
    <CookieConsentContext.Provider value={{ consent, accept, reject }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider",
    );
  }
  return ctx;
}
