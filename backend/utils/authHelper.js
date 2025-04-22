// utils/authHelpers.js

export const setAuthCookie = (res, accessToken) => {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
  };
