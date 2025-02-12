import { NextRequest, NextResponse } from 'next/server';
import { deleteCookie, getCookie, updateTokenExpirationCookie, verifyCookie } from './lib/cookies_setter';

// 1. Specify protected and public routes
const loggedInRoutes: __next_route_internal_types__.StaticRoutes[] = [
    '/dashboard',
    '/dashboard/profiles'
];
const authenticationRoutes: __next_route_internal_types__.StaticRoutes[] = [
    '/auth/login',
    '/auth/register'
];
const publicRoute: __next_route_internal_types__.StaticRoutes = "/"
const redirectToAuthentication: __next_route_internal_types__.StaticRoutes = '/auth/login'
const redirectToDashboard: __next_route_internal_types__.StaticRoutes = "/dashboard"

function deleteCookies() {
    deleteCookie('refresh-token')
    deleteCookie('token')
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public

    const nextUrl = req.nextUrl.pathname;
    if (nextUrl == publicRoute) return NextResponse.next()

    const isLoggedInRoute = loggedInRoutes.find(route => route == nextUrl);
    const isAuthenticationRoute = authenticationRoutes.find(route => route == nextUrl);

    const token = await getCookie('token')
    const ref_token = await getCookie('refresh-token')

    if (token == "" || ref_token == "") {
        if (!isAuthenticationRoute) return NextResponse.redirect(new URL(redirectToAuthentication, req.nextUrl));
        return NextResponse.next();
    } else {
        let verify_ = await verifyCookie('token');
        let isValidJWT: boolean = false
        if (!verify_.payload) {
            if (verify_.error && verify_.error?.code == "ERR_JWT_EXPIRED") {
                const refresh = await verifyCookie('refresh-token')
                if (refresh.payload) {
                    const changed = await updateTokenExpirationCookie('token')
                    if (changed) {
                        // console.log("Renewed token", await getCookie('token'))
                        verify_ = await verifyCookie('token');
                        isValidJWT = true
                    } else {
                        deleteCookies()
                    }
                } else {
                    deleteCookies()
                }
            } else {
                deleteCookies()
            }
        } else {
            isValidJWT = true
        }
        if (isValidJWT) {
            // console.log(verify_.payload)            
            if (!isLoggedInRoute) return NextResponse.redirect(new URL(redirectToDashboard, req.nextUrl));
            // validation here for Previlleges
            const route: __next_route_internal_types__.StaticRoutes = nextUrl as __next_route_internal_types__.StaticRoutes
            if (route == '/dashboard/profiles') {
                const canViewProfiles = verify_.payload?.previlleges.find(prev => prev.includes("profiles_view"))
                if (canViewProfiles) return NextResponse.next();
                return new NextResponse("Dont have access to this page.", { status: 404 })
            } else {
                return NextResponse.next();
            }
        } else {
            if (!isAuthenticationRoute) return NextResponse.redirect(new URL(redirectToAuthentication, req.nextUrl));
            return NextResponse.next();
        }

    }
}