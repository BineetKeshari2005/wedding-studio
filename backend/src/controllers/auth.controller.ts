import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const authService = new AuthService();

const setTokenCookies = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken, user } = await authService.register(req.body);
    setTokenCookies(res, refreshToken);
    const { password: _, ...safeUser } = user as any;
    return sendSuccess(res, { accessToken, user: safeUser }, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken, user } = await authService.login(req.body);
    setTokenCookies(res, refreshToken);
    const { password: _, ...safeUser } = user as any;
    return sendSuccess(res, { accessToken, user: safeUser });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { accessToken, refreshToken: newRefreshToken, userId } = await authService.refresh(refreshToken);
    setTokenCookies(res, newRefreshToken);
    return sendSuccess(res, { accessToken, userId });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return sendSuccess(res, { message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const user = await authService.me(userId);
    const { password: _, ...safeUser } = user as any;
    return sendSuccess(res, { user: safeUser });
  } catch (error) {
    next(error);
  }
};
