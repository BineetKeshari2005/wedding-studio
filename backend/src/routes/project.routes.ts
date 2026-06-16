import { Router } from 'express';
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { projectSchema } from '../validators/schema.validator';

const router = Router();

router.use(authenticate);

router.post('/', validate(projectSchema), createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/:id', validate(projectSchema), updateProject);
router.delete('/:id', deleteProject);

export default router;
