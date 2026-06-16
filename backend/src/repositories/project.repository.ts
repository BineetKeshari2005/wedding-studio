import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';

export class ProjectRepository {
  async create(data: Prisma.ProjectUncheckedCreateInput) {
    return prisma.project.create({ data });
  }

  async findByUserId(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.project.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  }
}
