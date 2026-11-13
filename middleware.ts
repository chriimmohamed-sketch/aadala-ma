import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define allowed roles for admin paths
const ADMIN_PATHS = ['/ar/admin', '/en/admin', '/fr/admin', '/es/admin', '/de/admin', '/fa/admin', '/tr/admin', '/nl/admin', '/it/admin']

// Define paths that require authentication
const AUTH_PATHS = ['/ar/profile', '/en/profile', '/fr/profile', '/es/profile', '/de/profile', '/fa/profile', '/tr/profile', '/nl/profile', '/it/profile']

// Define public paths (no auth required)
const PUBLIC_PATHS = [
  '/ar', '/en', '/fr', '/es', '/de', '/fa', '/tr', '/nl', '/it',
  '/ar/login', '/en/login', '/fr/login', '/es/login', '/de/login', '/fa/login', '/tr/login', '/nl/login', '/it/login',
  '/ar/register', '/en/register', '/fr/register', '/es/register', '/de/register', '/fa/register', '/tr/register', '/nl/register', '/it/register',
  '/ar/showcase', '/en/showcase', '/fr/showcase', '/es/showcase', '/de/showcase', '/fa/showcase', '/tr/showcase', '/nl/showcase', '/it/showcase',
  '/ar/legal', '/en/legal', '/fr/legal', '/es/legal', '/de/legal', '/fa/legal', '/tr/legal', '/nl/legal', '/it/legal',
  '/ar/case-law', '/en/case-law', '/fr/case-law', '/es/case-law', '/de/case-law', '/fa/case-law', '/tr/case-law', '/nl/case-law', '/it/case-law',
  '/ar/property', '/en/property', '/fr/property', '/es/property', '/de/property', '/fa/property', '/tr/property', '/nl/property', '/it/property',
  '/ar/inheritance', '/en/inheritance', '/fr/inheritance', '/es/inheritance', '/de/inheritance', '/fa/inheritance', '/tr/inheritance', '/nl/inheritance', '/it/inheritance',
  '/ar/procedures', '/en/procedures', '/fr/procedures', '/es/procedures', '/de/procedures', '/fa/procedures', '/tr/procedures', '/nl/procedures', '/it/procedures',
  '/ar/student', '/en/student', '/fr/student', '/es/student', '/de/student', '/fa/student', '/tr/student', '/nl/student', '/it/student',
  '/ar/ai', '/en/ai', '/fr/ai', '/es/ai', '/de/ai', '/fa/ai', '/tr/ai', '/nl/ai', '/it/ai',
  '/ar/founder', '/en/founder', '/fr/founder', '/es/founder', '/de/founder', '/fa/founder', '/tr/founder', '/nl/founder', '/it/founder',
]

// Role rankings (same as permissions.ts)
const ROLE_RANK: Record<string, number> = {
  visitor: 0, user: 1, researcher: 2, editor: 3, legal_reviewer: 3, translator: 3, admin: 5, super_admin: 6,
}

export function hasRole(userRole: string, required: string): boolean {
  return ROLE_RANK[userRole] >= ROLE_RANK[required] || ROLE_RANK['super_admin'] >= ROLE_RANK[required]
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  // eslint-disable-next-line no-unused-vars
  const locale: string = pathname.split('/')[1] || 'ar'
  
  // Check if path is in public list
  // eslint-disable-next-line no-unused-vars
  const isPublic: boolean = PUBLIC_PATHS.some(path => {
    const pattern = path.split('/').slice(1).join('/')
    return pathname === '/' + pattern || pathname.startsWith('/' + pattern + '/')
  })
  
  // Check if path is admin
  const isAdmin: boolean = ADMIN_PATHS.some(path => {
    const pattern = path.split('/').slice(1).join('/')
    return pathname === '/' + pattern || pathname.startsWith('/' + pattern + '/')
  })
  
  // Check if path requires auth
  const requiresAuth: boolean = AUTH_PATHS.some(path => {
    const pattern = path.split('/').slice(1).join('/')
    return pathname === '/' + pattern || pathname.startsWith('/' + pattern + '/')
  })

  // Get user role from session/cookie (Supabase JWT)
  // In production, this would read from the Supabase JWT payload
  // For now, we'll check if there's a session cookie
  const userRole = request.cookies.get('supabase') 
    ? 'user' // placeholder - real implementation would decode JWT
    : 'visitor'

  // If path is admin and user doesn't have admin role, redirect to login
  const userRank = ROLE_RANK[userRole] ?? 0
  const isAdminRank = ROLE_RANK['admin'] ?? 0
  // eslint-disable-next-line no-unused-vars
  const isSuperAdminRank = ROLE_RANK['super_admin'] ?? 0
  if (isAdmin && userRank < isAdminRank) {
    const searchParams = request.nextUrl.searchParams.toString()
    const redirectUrl = pathname + searchParams
    return NextResponse.redirect(new URL(`/ar/login?redirect=${encodeURIComponent(redirectUrl)}`, request.url))
  }

  // If path requires auth and user is not logged in, redirect to login
  const requiresAuthRank = ROLE_RANK['user'] ?? 1
  if (requiresAuth && userRank < requiresAuthRank) {
    const searchParams = request.nextUrl.searchParams.toString()
    const redirectUrl = pathname + searchParams
    return NextResponse.redirect(new URL(`/ar/login?redirect=${encodeURIComponent(redirectUrl)}`, request.url))
  }

  // Continue if all checks pass
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/:locale/(admin/:path*)',
    '/:locale/profile/:path*',
    '/:locale/api/:path*',
  ],
}