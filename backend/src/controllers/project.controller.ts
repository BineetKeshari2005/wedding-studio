import { Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const projectService = new ProjectService();

export const createProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.create(req.user!.userId, req.body);
    return sendSuccess(res, project, 201);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const projects = await projectService.getUserProjects(req.user!.userId);
    return sendSuccess(res, projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.getProjectById(req.user!.userId, req.params.id as string);
    return sendSuccess(res, project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.update(req.user!.userId, req.params.id as string, req.body);
    return sendSuccess(res, project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await projectService.delete(req.user!.userId, req.params.id as string);
    return sendSuccess(res, { message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
