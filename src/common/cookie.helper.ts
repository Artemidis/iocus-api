import {Response} from "express";

export const setAuthCookies = (
    res: Response,
    accessToken: string,
    refreshToken?: string,
) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // не через process.env
        sameSite: 'lax',
        maxAge: 60 * 15 * 1000,
        path: '/',
    })

    if (refreshToken) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 * 1000,
            path: '/',
        })
    }
}