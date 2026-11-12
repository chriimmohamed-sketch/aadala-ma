import type { NextConfig } from "next";

// Security headers for the Next.js app (Workers). Static HTML pages keep their own CSP meta.
// In dev, React Refresh / HMR needs 'unsafe-eval'; production keeps the stricter policy.
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])].join(" ");
const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https:",
  "connect-src 'self' https://pvoenvxinkipgpnddumt.supabase.co wss://pvoenvxinkipgpnddumt.supabase.co https://aadala-ma.cheraimmohamed20.workers.dev",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

async function headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: csp },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
  ];
}


async function redirects() {
  const base = "/ar";
  const map: [string, string][] = [
    ["/legal-ai.html", `${base}/ai`],
    ["/gazette.html", `${base}/legal/bulletin-officiel-7437`],
    ["/case-law.html", `${base}/case-law`],
    ["/inheritance.html", `${base}/legal`],
    ["/real-estate.html", `${base}/property`],
    ["/criminal.html", `${base}/criminal`],
    ["/procedures.html", `${base}/procedures`],
    ["/fiqh.html", `${base}/sharia`],
    ["/legal-aid.html", `${base}/legal-aid`],
    ["/academic.html", `${base}/academic`],
    ["/database.html", `${base}/legal`],
    ["/founder.html", `${base}/founder`],
    ["/design-system.html", `${base}/showcase`],
    ["/privacy.html", `${base}/privacy`],
    ["/terms.html", base],
    ["/contact.html", base],
  ];
  return map.map(([source, destination]) => ({
    source,
    destination,
    permanent: false,
  }));
}

const nextConfig: NextConfig = {
  cacheComponents: false,
  partialPrefetching: false,
  headers,
  redirects,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
