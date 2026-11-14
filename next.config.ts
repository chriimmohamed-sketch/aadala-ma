import type { NextConfig } from "next";

// Security headers for the Next.js app (Workers). The static HTML prototype keeps its own CSP meta.
// Dev keeps 'unsafe-eval' for React Refresh/HMR; production stays strict.
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
    {
      // Stricter headers for admin routes (auth subpaths)
      source: "/:locale/admin/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          value:
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; connect-src 'self' https://pvoenvxinkipgpnddumt.supabase.co; frame-ancestors 'self'; object-src 'none'",
        },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    },
    {
      // API surface: no framing, no scripts
      source: "/api/:path*",
      headers: [
        { key: "Content-Security-Policy", value: "default-src 'none'; frame-ancestors 'none'" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
      ],
    },
  ];
}

// Redirect legacy static HTML paths to the canonical Next.js routes (from the deployed app)
async function redirects() {
  const map = [
    { from: "/index.html", to: "/" },
    { from: "/encyclopedia.html", to: "/ar/legal" },
    { from: "/gazette.html", to: "/ar/legal/bulletin-officiel-7437" },
    { from: "/legal-ai.html", to: "/ar/ai" },
    { from: "/academic.html", to: "/ar/academic" },
    { from: "/real-estate.html", to: "/ar/property" },
    { from: "/inheritance.html", to: "/ar/miyar" },
    { from: "/criminal.html", to: "/ar/criminal" },
    { from: "/procedures.html", to: "/ar/procedures" },
    { from: "/founder.html", to: "/ar/founder" },
    { from: "/case-law.html", to: "/ar/case-law" },
    { from: "/legal-aid.html", to: "/ar/legal-aid" },
    { from: "/privacy.html", to: "/ar/privacy" },
  ];
  return map.map(({ from, to }) => ({
    source: from,
    destination: to,
    permanent: false,
  }));
}

const nextConfig: NextConfig = {
  cacheComponents: false,
  partialPrefetching: false,
  headers,
  redirects,
  webpack: (config) => {
    // Windows build workaround: fabric native bindings are invalid, alias to the JS shim
    config.resolve.alias.fabric = "fabric-net";
    return config;
  },
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
