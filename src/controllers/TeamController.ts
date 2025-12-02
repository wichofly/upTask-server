import { Request, Response } from 'express';
import User from '../models/User';

export class TeamMemberController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email }).select('id email name');

      if (!user) return res.status(404).json({ error: 'User not found' });

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
}
