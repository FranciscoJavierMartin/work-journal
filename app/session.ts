import {
  createCookieSessionStorage,
  type Session,
  type SessionData,
} from '@remix-run/node';

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: process.env.COOKIE_AUTH_NAME,
      secrets: [process.env.COOKIE_AUTH_SECRET!],
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  });

export async function getSessionFromCookieInsideRequest(
  request: Request,
): Promise<Session<SessionData, SessionData>> {
  return await getSession(request.headers.get('Cookie'));
}
