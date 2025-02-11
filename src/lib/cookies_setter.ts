
import { cookies } from 'next/headers';
import { verify, encrypt } from './jwt';
import { Cookie } from 'next/font/google';
import { Previllege, User } from '@prisma/client';
import { Infer } from 'next/dist/compiled/superstruct';

const one_hour_to_Milliseconds = 3600000
const refreshTokenExpiration = "1 week"
const tokenExpiration = "1 min"

export type Cookie = "token" | "refresh-token"


export type PayloadToken = {
    userId: number,
    previlleges: string[]
};

export async function getCookie(type: Cookie) {
    const cook = (await cookies()).get(type)
    if (cook) return cook.value
    return ""
}

export async function setCookie(payload: PayloadToken, type: Cookie) {
    let token = null
    if (type == 'token') {
        token = await encrypt(payload, tokenExpiration);
    } else {
        token = await encrypt(payload, refreshTokenExpiration);
    }
    (await cookies()).set(type, token, {
        httpOnly: true,
        secure: true,
        // expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function updateTokenExpirationCookie(type: Cookie) {
    const cookie = await getCookie(type);
    const ver = await verify<PayloadToken>(cookie);
    let payload: PayloadToken | null
    if (!ver.payload) {
        if (ver.error && ver.error?.code == "ERR_JWT_EXPIRED") {
            payload = { userId: ver.error.payload.userId, previlleges: ver.error.payload.previlleges }
        } else {
            payload = null
        }
    } else {
        payload = ver.payload
    }
    let token = null
    if (payload) {
        if (type == 'token') {
            token = await encrypt(payload, tokenExpiration);
        } else {
            token = await encrypt(payload, refreshTokenExpiration);
        }
        (await cookies()).set(type, token, {
            httpOnly: true,
            secure: true,
            // expires: expires,
            sameSite: 'lax',
            path: '/',
        });
        return true
    }
    return false

}
export async function verifyCookie(type: Cookie) {
    const cookie = await getCookie(type);
    return await verify<PayloadToken>(cookie);
}


export async function deleteCookie(type: Cookie) {
    (await cookies()).delete(type);
}