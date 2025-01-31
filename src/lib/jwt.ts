import 'server-only';

import { JWTPayload, SignJWT, jwtDecrypt, jwtVerify } from 'jose';

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload, expiration: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(key);
}
type DecType<ExpectedObject> = {
  payload?: ExpectedObject;
  error?: any
}
export async function verify<ExpectedObject>(session: string | undefined = ''): Promise<DecType<ExpectedObject>> {
  try {
    const { payload } = await jwtVerify<ExpectedObject>(session, key, {
      algorithms: ['HS256'],
    });
    return { payload };
  } catch (error) {
    return { error }
  }
}


