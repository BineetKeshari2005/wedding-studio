import { Response, NextFunction } from 'express';
import { StudioService } from '../services/studio.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const studioService = new StudioService();

// POST /api/studio/project
export const createStudioProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const project = await studioService.createProject(req.user!.userId, req.body);
    return sendSuccess(res, project, 201);
  } catch (error) {
    next(error);
  }
};

// GET /api/studio/project/:id
export const getStudioProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const project = await studioService.getProject(req.user!.userId, req.params.id as string);
    return sendSuccess(res, project);
  } catch (error) {
    next(error);
  }
};

// GET /api/studio/projects  (list all for user)
export const getStudioProjects = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const projects = await studioService.getUserProjects(req.user!.userId);
    return sendSuccess(res, projects);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/studio/project/:id
export const updateStudioProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const project = await studioService.updateProject(req.user!.userId, req.params.id as string, req.body);
    return sendSuccess(res, project);
  } catch (error) {
    next(error);
  }
};

// POST /api/studio/save-selection
export const saveSelection = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const concepts = await studioService.saveSelection(req.user!.userId, req.body);
    return sendSuccess(res, concepts, 201);
  } catch (error) {
    next(error);
  }
};

// GET /api/studio/moodboard/:projectId
export const getMoodboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const moodboard = await studioService.getMoodboard(req.user!.userId, req.params.projectId as string);
    return sendSuccess(res, moodboard);
  } catch (error) {
    next(error);
  }
};
