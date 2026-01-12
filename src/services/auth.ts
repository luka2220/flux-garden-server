import { Hono } from 'hono';

import type { HonoContext } from '@/shared/types';
import { eq } from 'drizzle-orm';
import { googleAuth } from '@hono/oauth-providers/google';
import { usersTable } from '@/db/schema';
import { sign } from 'hono/jwt';
import { setCookie } from 'hono/cookie';
import { ErrorCodes } from '@/config/constants';

export const authService = new Hono<HonoContext>();

authService.get(
  '/google/cb',
  (c, next) => {
    const handler = googleAuth({
      client_id: c.env.GOOGLE_CLIENT_ID,
      client_secret: c.env.GOOGLE_CLIENT_SECRET,
      scope: ['openid', 'profile', 'email'],
      access_type: 'offline',
      prompt: 'consent',
    });

    return handler(c, next);
  },
  async (c) => {
    const db = c.get('db');

    // Google OAuth data
    const token = c.get('token');
    const user = c.get('user-google');
    const refreshToken = c.get('refresh-token');
    const grantedScopes = c.get('granted-scopes');

    if (!token || !grantedScopes || !user) {
      console.log('Data missing from google response: ', {
        token,
        grantedScopes,
        user,
      });

      return c.redirect('http://localhost:5173');
    }

    const userRecords = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, user.id!))
      .limit(1)
      .execute();

    let userData = userRecords[0];

    if (!userData) {
      const newRecordData = {
        id: user?.id!,
        email: user?.email!,
        name: user?.name!,
        refresh_token: refreshToken?.token!,
        photo_url: user?.picture!,
      };

      const [newUser] = await db
        .insert(usersTable)
        .values(newRecordData)
        .returning();

      if (!newUser) {
        // TODO: Better error handling logic
        throw new Error(
          `${ErrorCodes.Auth} Error creating new user record: ${JSON.stringify(
            newRecordData
          )}`
        );
      }

      userData = newUser;
    }

    const payload = {
      userId: userData.id,
      userEmail: userData.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 5, // 5 min token expiration
    };
    const jwtToken = await sign(payload, c.env.JWT_SECRET);

    setCookie(c, 'authToken', jwtToken, {
      maxAge: 60 * 5, // 5 minutes
      // secure: true,
      secure: false,
      sameSite: 'Lax',
      httpOnly: true,
    });

    return c.redirect('http://localhost:5173/dashboard');
  }
);
