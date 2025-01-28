import 'server-only';

import { JWTPayload, SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

type Aaa = {
  name: string
}

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1hr')
    .sign(key);
}

export async function decrypt<ExpectedObject>(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify<ExpectedObject>(session, key, {
      algorithms: ['HS256'],
    });
    return { payload, error: null };
  } catch (error) {
    return { error, payload: null }
  }
}

