import type { ErrorHandler } from 'hono';
import { ErrorCodes } from '@/config/constants';

export const errorHandler: ErrorHandler = (error, c) => {
  if (error instanceof Error && error.message.startsWith(ErrorCodes.Auth)) {
    console.error('Auth Error', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    c.redirect('http://localhost:5173');
  }

  console.error('An error occurred', {
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
  });

  return c.json(
    {
      message: 'Something went wrong',
    },
    500
  );
};
