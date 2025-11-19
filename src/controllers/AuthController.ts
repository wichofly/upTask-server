import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import Token from '../models/Token';
import { AuthEmail } from '../emails/AuthEmail';

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

      // Generate confirmation token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Send an email with token
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send(
        'Account created successfully, check your email to confirm your account'
      );
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      // Validate token
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Confirm the user's account
      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      // Delete the token after confirmation
      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

      res.send('Account confirmed successfully');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
}
