import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/auth';

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Create an user
      const user = new User(req.body);

      // Hash password
      user.password = await hashPassword(password);

      await user.save();
      res.send(
        'Account created successfully, check your email to confirm your account'
      );
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
}
