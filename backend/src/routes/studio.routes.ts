import { Router } from 'express';
import {
  createStudioProject,
  getStudioProject,
  getStudioProjects,
  updateStudioProject,
  saveSelection,
  getMoodboard,
} from '../controllers/studio.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createStudioProjectSchema,
  updateStudioProjectSchema,
  saveSelectionSchema,
} from '../validators/studio.validator';

const router = Router();

// All studio routes require authentication
router.use(authenticate);

// Project CRUD
router.post('/project', validate(createStudioProjectSchema), createStudioProject);
router.get('/projects', getStudioProjects);
router.get('/project/:id', getStudioProject);
router.patch('/project/:id', validate(updateStudioProjectSchema), updateStudioProject);

// Concept selection
router.post('/save-selection', validate(saveSelectionSchema), saveSelection);

// Moodboard
router.get('/moodboard/:projectId', getMoodboard);

export default router;
