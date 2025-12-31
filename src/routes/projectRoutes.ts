import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { TaskController } from '../controllers/TaskController';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import { projectExists } from '../middleware/project';
import {
  taskExists,
  taskBelongsToProject,
  hasAuthorizationOnTask,
} from '../middleware/task';
import { authenticateUser } from '../middleware/auth';
import { TeamMemberController } from '../controllers/TeamController';
import { NoteController } from '../controllers/NoteController';

const router = Router();

router.use(authenticateUser); // Apply authentication middleware to all routes below
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
router.param('projectId', projectExists);

router.post(
  '/:projectId/tasks',
  hasAuthorizationOnTask,
  body('name').notEmpty().withMessage('Task name is required'),
  body('description').notEmpty().withMessage('Task description is required'),

  handleInputErrors,
  TaskController.createTask
);

router.get('/:projectId/tasks', TaskController.getProjectTasks);

router.param('taskId', taskExists);
router.param('taskId', taskBelongsToProject);

router.get(
  '/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('Invalid task ID'),
  handleInputErrors,
  TaskController.getTaskById
);

router.put(
  '/:projectId/tasks/:taskId',
  hasAuthorizationOnTask,
  param('taskId').isMongoId().withMessage('Invalid task ID'),
  body('name').notEmpty().withMessage('Task name cannot be empty'),
  body('description')
    .notEmpty()
    .withMessage('Task description cannot be empty'),

  handleInputErrors,
  TaskController.updateTask
);

router.delete(
  '/:projectId/tasks/:taskId',
  hasAuthorizationOnTask,
  param('taskId').isMongoId().withMessage('Invalid task ID'),
  handleInputErrors,
  TaskController.deleteTask
);

router.post(
  '/:projectId/tasks/:taskId/status',
  param('taskId').isMongoId().withMessage('Invalid task ID'),
  body('status').notEmpty().withMessage('Status is required'),
  handleInputErrors,
  TaskController.updateTaskStatus
);

/** Routes for teams */

router.post(
  '/:projectId/team/find',
  body('email').isEmail().toLowerCase().withMessage('Invalid email'),
  handleInputErrors,
  TeamMemberController.findMemberByEmail
);

router.post(
  '/:projectId/team',
  body('id').isMongoId().withMessage('Invalid user ID'),
  handleInputErrors,
  TeamMemberController.addMemberById
);

router.get(
  '/:projectId/team',
  handleInputErrors,
  TeamMemberController.getProjectTeam
);

router.delete(
  '/:projectId/team/:userId',
  param('userId').isMongoId().withMessage('Invalid user ID'),
  handleInputErrors,
  TeamMemberController.removeMemberById
);

/** Routes for notes */
router.post(
  '/:projectId/tasks/:taskId/notes',
  body('content').notEmpty().withMessage('Note content is required'),
  handleInputErrors,
  NoteController.createNote
);

router.get('/:projectId/tasks/:taskId/notes', NoteController.getTaskNotes);

export default router;
