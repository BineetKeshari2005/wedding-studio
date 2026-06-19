import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';

export class StudioRepository {
  // ── StudioProject ──

  async createProject(data: Prisma.StudioProjectUncheckedCreateInput) {
    return prisma.studioProject.create({
      data,
      include: { savedConcepts: true },
    });
  }

  async findProjectById(id: string) {
    return prisma.studioProject.findUnique({
      where: { id },
      include: { savedConcepts: { orderBy: { createdAt: 'asc' } } },
    });
  }

  async findProjectsByUserId(userId: string) {
    return prisma.studioProject.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { savedConcepts: true },
    });
  }

  async updateProject(id: string, data: Prisma.StudioProjectUncheckedUpdateInput) {
    return prisma.studioProject.update({
      where: { id },
      data,
      include: { savedConcepts: { orderBy: { createdAt: 'asc' } } },
    });
  }

  async deleteProject(id: string) {
    return prisma.studioProject.delete({ where: { id } });
  }

  // ── SavedConcept ──

  async createConcept(data: Prisma.SavedConceptUncheckedCreateInput) {
    return prisma.savedConcept.create({ data });
  }

  async createManyConcepts(data: Prisma.SavedConceptUncheckedCreateInput[]) {
    // Prisma createMany doesn't return records, so use a transaction
    return prisma.$transaction(
      data.map((d) => prisma.savedConcept.create({ data: d }))
    );
  }

  async findConceptsByProject(projectId: string) {
    return prisma.savedConcept.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findConceptsByProjectAndSection(projectId: string, section: string) {
    return prisma.savedConcept.findMany({
      where: { projectId, section },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateConcept(id: string, data: Prisma.SavedConceptUncheckedUpdateInput) {
    return prisma.savedConcept.update({ where: { id }, data });
  }

  async deleteConcept(id: string) {
    return prisma.savedConcept.delete({ where: { id } });
  }

  async deleteConceptsByProjectAndSection(projectId: string, section: string) {
    return prisma.savedConcept.deleteMany({ where: { projectId, section } });
  }
}
