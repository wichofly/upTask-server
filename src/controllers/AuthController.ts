import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import Token from '../models/Token';
import { transporter } from '../config/nodemailer';

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
      await transporter.sendMail({
        from: '"UpTask" <no-reply@uptask.com>',
        to: user.email,
        subject: 'Confirm your account',
        text: `Please confirm your account by clicking the following link: http://localhost:5173/confirm/${token.token}`,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send(
        'Account created successfully, check your email to confirm your account'
      );
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
}
