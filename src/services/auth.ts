import { Hono } from 'hono';

import type { HonoContext } from '@/shared/types';
import { eq } from 'drizzle-orm';
import { googleAuth } from '@hono/oauth-providers/google';
import { usersTable } from '@/db/schema';

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
    const token = c.get('token');
    const refreshToken = c.get('refresh-token');
    const grantedScopes = c.get('granted-scopes');
    const user = c.get('user-google');
    const db = c.get('db');

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
      // Create new user here
      await db.insert(usersTable).values({
        id: user?.id!,
        email: user?.email!,
        name: user?.name!,
        refresh_token: refreshToken?.token!,
        photo_url: user?.picture!,
      });
    }

    // Create JWT here
    // const payload = {
    //   userId: user?.id!
    // }

    return c.json({
      token,
      grantedScopes,
      user,
      refreshToken,
    });
  }
);
