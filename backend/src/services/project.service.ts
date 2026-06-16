import { ProjectRepository } from '../repositories/project.repository';

export class ProjectService {
  private projectRepository = new ProjectRepository();

  async create(userId: string, data: any) {
    return this.projectRepository.create({
      ...data,
      userId,
    });
  }

  async getUserProjects(userId: string) {
    return this.projectRepository.findByUserId(userId);
  }

  async getProjectById(userId: string, projectId: string) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw { statusCode: 404, message: 'Project not found' };
    }
    if (project.userId !== userId) {
      throw { statusCode: 403, message: 'Forbidden' };
    }
    return project;
  }

  async update(userId: string, projectId: string, data: any) {
    const project = await this.getProjectById(userId, projectId); // verifies ownership
    return this.projectRepository.update(projectId, data);
  }

  async delete(userId: string, projectId: string) {
    const project = await this.getProjectById(userId, projectId); // verifies ownership
    return this.projectRepository.delete(projectId);
  }
}
