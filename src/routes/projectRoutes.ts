import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { body } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';

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

export default router;
