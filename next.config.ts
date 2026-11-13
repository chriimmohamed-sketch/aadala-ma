/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  webpack: (config) => {
    config.resolve.alias.fabric = 'fabric-net';
    return config;
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:all',
        headers: [
          // Content Security Policy - restrict sources
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-src 'none'; base-uri 'self'; form-action 'self';",
          },
          // HTTP Strict Transport Security
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // X-Frame-Options - prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // X-Content-Type-Options - prevent MIME sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer-Policy
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Permissions-Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()',
          },
        ],
      },
      {
        // Stricter headers for admin routes
        source: '/:locale/admin/:path*',
        headers: [
          {
            key: 'Content-SecurityPolicy',
            value: "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; frame-src 'none';",
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        // Secure headers for API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'none'; style-src 'self'; img-src 'self'; connect-src 'self'; frame-src 'none';",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'RateLimit-Limit',
            value: '8',
          },
          {
            key: 'RateLimit-Window',
            value: '60',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig