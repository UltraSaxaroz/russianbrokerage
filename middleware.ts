import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify, JWTPayload } from 'jose'

interface JWTPayloadWithRole extends JWTPayload {
    role?: string
}

const protectedRoutes: Array<[string, string[]]> = [
    ['/admin', ['admin']],
    ['/panel', ['admin', 'user']]
]

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value

    if (!token) {
        return NextResponse.redirect(new URL('/auth', request.url))
    }

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
        const user = payload as JWTPayloadWithRole

        const path = request.nextUrl.pathname
        let isAuthorized = true

        for (const [route, allowedRoles] of protectedRoutes) {
            if (path.startsWith(route)) {
                isAuthorized = allowedRoles.includes(user.role || '')
                break
            }
        }

        if (!isAuthorized) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        return NextResponse.next()
    } catch (error) {
        console.error('Error verifying token:', error)
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: ['/admin/:path*', '/panel/:path*']
}