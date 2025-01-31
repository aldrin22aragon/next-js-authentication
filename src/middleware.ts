import { NextRequest, NextResponse } from 'next/server';
import { deleteCookie, getCookie, PayloadToken, updateTokenExpirationCookie, verifyCookie } from './lib/cookies_setter';
import { Vault } from 'lucide-react';

// 1. Specify protected and public routes
const loggedInRoutes = ['/dashboard'];
const authenticationRoutes = ['/'];
const redirectToAuthentication = "/"
const redirectToDashboard = "/dashboard"

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
    const isLoggedInRoute = loggedInRoutes.includes(nextUrl);
    const isAuthenticationRoute = authenticationRoutes.includes(nextUrl);

    const token = await getCookie('token')
    const ref_token = await getCookie('refresh-token')

    if (token == "" || ref_token == "") {
        if (!isAuthenticationRoute) {
            return NextResponse.redirect(new URL(redirectToAuthentication, req.nextUrl));
        } else {
            return NextResponse.next();
        }
    } else {
        const verify_ = await verifyCookie('token');
        let isValidJWT: boolean = false
        if (!verify_.payload) {
            if (verify_.error && verify_.error?.code == "ERR_JWT_EXPIRED") {
                const refresh = await verifyCookie('refresh-token')
                if (refresh.payload) {
                    const changed = await updateTokenExpirationCookie('token')
                    if (changed) {
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
            if (!isLoggedInRoute) {
                return NextResponse.redirect(new URL(redirectToDashboard, req.nextUrl));
            } else {
                return NextResponse.next();
            }
        } else {
            if (!isAuthenticationRoute) {
                return NextResponse.redirect(new URL(redirectToAuthentication, req.nextUrl));
            } else {
                return NextResponse.next();
            }
        }

    }
}