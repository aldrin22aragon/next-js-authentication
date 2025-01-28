
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt, encrypt } from './jwt';
import { number } from 'zod';

export type SessionPayload = {
    userId: string | number;
    expiresAt?: Date;
};

export async function setSession(payload: SessionPayload) {
    const one_hour_to_Milliseconds = 3600000
    const expiresAt = new Date(Date.now() + one_hour_to_Milliseconds); // dapat one day yung exxpiration
    const session = await encrypt(payload);
    (await cookies()).set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
    redirect('/dashboard');
}

export async function verifySession() {
    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);
    if (!session.payload?.userId) {
        redirect('/');
    }
    return { isAuth: true, userId: Number(session.payload?.userId) };
}

export async function updateSession() {
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);

    if (!session || !payload) {
        return null;
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    (await cookies()).set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    });
}

export async function deleteSession() {
    (await cookies()).delete('session');
    redirect('/login');
}