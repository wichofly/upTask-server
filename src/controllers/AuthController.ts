import { Request, Response } from 'express';
import User from '../models/User';
import { comparePassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import Token from '../models/Token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';

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
        return res.status(404).json({ error: 'Invalid token' });
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

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.confirmed) {
        const token = new Token();
        token.token = generateToken();
        token.user = user.id;
        await token.save();

        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        return res.status(401).json({
          error: 'Account not confirmed, confirmation code sent to email',
        });
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const jwtToken = generateJWT({ id: user.id });

      res.send(jwtToken);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User is not registered' });
      }

      // Check if user is already confirmed
      if (user.confirmed) {
        return res.status(403).json({ error: 'Account is already confirmed' });
      }

      // Delete any existing tokens for this user before creating a new one
      await Token.deleteMany({ user: user.id });

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

      res.send('New confirmation code sent to your email');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User is not registered' });
      }

      // Delete any existing tokens for this user before creating a new one
      await Token.deleteMany({ user: user.id });

      // Generate confirmation token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      await token.save();

      // Send an email with token
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send('New confirmation code sent to your email');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      // Validate token
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        return res.status(404).json({ error: 'Invalid token' });
      }

      res.send('Token is valid, proceed to reset password');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params; // Get token from URL parameters
      const { password } = req.body;

      // Validate token
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        return res.status(404).json({ error: 'Invalid token' });
      }

      const user = await User.findById(tokenExists.user); // Find user by token's user ID
      user.password = await hashPassword(password); // Hash new password

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]); // Save user and delete token

      res.send('Password has been successfully updated');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static userProfile = async (req: Request, res: Response) => {
    return res.json(req.user);
  };
}
