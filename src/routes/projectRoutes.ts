import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { TaskController } from '../controllers/TaskController';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import { validateProjectExists } from '../middleware/projects';

const router = Router();

router.post(
  '/',
  body('projectName').notEmpty().withMessage('Project name is required'),
  body('clientName').notEmpty().withMessage('Client name is required'),
  body('description')
    .notEmpty()
    .withMessage('Description of the project is required'),

  handleInputErrors,
  ProjectController.createProject
);

router.get('/', ProjectController.getAllProjects);

router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid project ID'),
  handleInputErrors,
  ProjectController.getProjectById
);

router.put(
  '/:id',
  param('id').isMongoId().withMessage('Invalid project ID'),
  body('projectName').notEmpty().withMessage('Project name cannot be empty'),
  body('clientName').notEmpty().withMessage('Client name cannot be empty'),
  body('description').notEmpty().withMessage('Description cannot be empty'),

  handleInputErrors,
  ProjectController.updateProject
);

router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid project ID'),
  handleInputErrors,
  ProjectController.deleteProject
);

/** Routes for tasks */
router.post(
  '/:projectId/tasks',
  // param('projectId').isMongoId().withMessage('Invalid project ID'),
  // body('name').notEmpty().withMessage('Task name is required'),
  // body('description').notEmpty().withMessage('Task description is required'),
  // handleInputErrors,

  validateProjectExists,
  TaskController.createTask
);

export default router;
