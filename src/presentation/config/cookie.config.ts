import { Request, Response } from "express";

export interface CookieConfig {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge: number,
}

export const getAccessTokenCookieConfig = (): CookieConfig => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
});

export const getRefreshTokenCookieConfig = (): CookieConfig => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 day
});

export const COOKIE_NAMES = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
} as const;

export const setTokensCookie = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, getAccessTokenCookieConfig());
    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, getRefreshTokenCookieConfig());
}

export const clearTokensCookie = (res: Response) => {
    res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, getAccessTokenCookieConfig());
    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, getRefreshTokenCookieConfig());
}

export const getRefreshToken = (req: Request): string => {
    return req.cookies[COOKIE_NAMES.REFRESH_TOKEN]
}