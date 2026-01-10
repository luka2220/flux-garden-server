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
    });
    return handler(c, next);
  },
  async (c) => {
    // state=3lnahbdecc5-j3rsyilqp2-dpxp003ds3&code=4%2F0ASc3gC1cWMdmcvRXXHYEOcl8CoUsfn8hLE3l5OYlvy1CNAR_xiQC8p-xoozTNo52dZMASA
    // scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile
    // authuser=0
    // prompt=none
    const token = c.get('token');
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

    const userData = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, user?.id));

    // Do some auth/login logic here
    // Cookie/token refreshing...

    // return c.redirect('http://localhost:5173');
    return c.json({
      token,
      grantedScopes,
      user,
    });
  }
);
