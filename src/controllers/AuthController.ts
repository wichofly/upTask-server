import { Request, Response } from 'express';

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      res.send('Account created successfully');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
}
