import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const user = new User(req.body);

      // hash password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(req.body.password, salt)

      await user.save();
      res.send(
        'Account created successfully, check your email to confirm your account'
      );
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
}
