import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { TokenRepository } from '../repositories/token.repository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export class AuthService {
  private userRepository = new UserRepository();
  private tokenRepository = new TokenRepository();

  async register(data: any) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw { statusCode: 400, message: 'Email already in use' };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user.id);
    return { ...tokens, user };
  }

  async login(data: any) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const tokens = await this.generateTokens(user.id);
    return { ...tokens, user };
  }

  async refresh(token: string) {
    if (!token) {
      throw { statusCode: 401, message: 'No refresh token provided' };
    }

    const savedToken = await this.tokenRepository.findByToken(token);
    if (!savedToken) {
      throw { statusCode: 401, message: 'Invalid refresh token' };
    }

    try {
      const decoded = verifyRefreshToken(token);
      return this.generateTokens(decoded.userId);
    } catch (error) {
      await this.tokenRepository.deleteByToken(token);
      throw { statusCode: 401, message: 'Invalid or expired refresh token' };
    }
  }

  async logout(token: string) {
    if (token) {
      await this.tokenRepository.deleteByToken(token);
    }
  }

  async me(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }
    return user;
  }

  private async generateTokens(userId: string) {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

    await this.tokenRepository.create({
      token: refreshToken,
      userId,
      expiresAt,
    });

    return { accessToken, refreshToken, userId };
  }
}
