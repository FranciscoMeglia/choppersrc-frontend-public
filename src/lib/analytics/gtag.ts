declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function pageview(path: string) {
  window.gtag?.("event", "page_view", { page_path: path });
}

export function event(name: string, params?: Record<string, unknown>) {
  window.gtag?.("event", name, params);
}
