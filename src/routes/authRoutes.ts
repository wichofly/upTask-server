import { Router } from 'express';
import { body, param } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middleware/validation';
import { authenticateUser } from '../middleware/auth';

const router = Router();

router.post(
  '/create-account',
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),

  handleInputErrors,
  AuthController.createAccount
);

router.post(
  '/confirm-account',
  body('token').notEmpty().withMessage('Token is required'),

  handleInputErrors,
  AuthController.confirmAccount
);

router.post(
  '/login',
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),

  handleInputErrors,
  AuthController.login
);

router.post(
  '/request-code',
  body('email').isEmail().withMessage('Valid email is required'),

  handleInputErrors,
  AuthController.requestConfirmationCode
);

router.post(
  '/forgot-password',
  body('email').isEmail().withMessage('Valid email is required'),

  handleInputErrors,
  AuthController.forgotPassword
);

router.post(
  '/validate-token',
  body('token').notEmpty().withMessage('Token is required'),

  handleInputErrors,
  AuthController.validateToken
);

router.post(
  '/update-password/:token',
  param('token').isNumeric().withMessage('Valid token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
    
  handleInputErrors,
  AuthController.updatePasswordWithToken
);

router.get('/user-profile', authenticateUser, AuthController.userProfile)

export default router;
