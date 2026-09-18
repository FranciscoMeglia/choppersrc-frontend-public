import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Default config path (`./src/i18n/request.ts`) — see that file for the
// per-request locale/messages resolution.
const withNextIntl = createNextIntlPlugin();

// Product/blog images come from the backend as relative paths
// (`/uploads/...`, see docs/backend-analysis.md §2) — we build the full URL
// with NEXT_PUBLIC_API_ORIGIN and need to declare that origin here to be
// able to use `next/image` with them. Adjust once a real production domain exists.
const backendOrigin = new URL(process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:3000");

// In local dev the backend origin is localhost, which Next's image
// optimizer refuses by default (SSRF protection — a remote origin could
// otherwise trick the server into fetching its own private network). That
// protection only makes sense for a *remote* origin; against our own
// backend on localhost it's a false positive, so it's opted out of only
// when the origin actually is a loopback address — a real production
// `NEXT_PUBLIC_API_ORIGIN` (a real domain) keeps the protection on.
const isLocalBackend = ["localhost", "127.0.0.1", "::1"].includes(
  backendOrigin.hostname,
);

const nextConfig: NextConfig = {
  // This repo already has its own conventions (see README.md/docs) — no need
  // for Next to generate its own AGENTS.md/CLAUDE.md on every `next dev`.
  agentRules: false,
  // Self-contained build in .next/standalone (server.js + only the
  // node_modules it actually needs) — that's what the Dockerfile ships,
  // instead of the whole node_modules tree.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: backendOrigin.protocol.replace(":", "") as "http" | "https",
        hostname: backendOrigin.hostname,
        port: backendOrigin.port || undefined,
        pathname: "/uploads/**",
      },
    ],
    ...(isLocalBackend ? { dangerouslyAllowLocalIP: true } : {}),
  },
};

export default withNextIntl(nextConfig);
