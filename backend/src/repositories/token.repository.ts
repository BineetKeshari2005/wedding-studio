import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';

export class TokenRepository {
  async create(data: Prisma.RefreshTokenUncheckedCreateInput) {
    return prisma.refreshToken.create({ data });
  }

  async findByToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  async deleteByToken(token: string) {
    return prisma.refreshToken.deleteMany({ where: { token } });
  }

  async deleteByUserId(userId: string) {
    return prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
