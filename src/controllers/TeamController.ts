import { Request, Response } from 'express';
import User from '../models/User';
import Project from '../models/Project';

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

  static addMemberById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      // Find user by ID
      const user = await User.findById(id).select('id email name');
      if (!user) return res.status(404).json({ error: 'User not found' });

      // Check if user is already a team member
      if (
        req.project.team.some(
          (member) => member.toString() === user.id.toString()
        )
      ) {
        return res.status(409).json({ error: 'User is already a team member' });
      }

      // Add the user to the project's team
      req.project.team.push(user.id);
      await req.project.save();

      res.send('Team member added successfully');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static getProjectTeam = async (req: Request, res: Response) => {
    try {
      const project = await Project.findById(req.project.id).populate(
        'team',
        'email name'
      );
      if (!project) return res.status(404).json({ error: 'Project not found' });

      res.json(project.team);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static removeMemberById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      // Check if user is not a team member
      if (!req.project.team.some((member) => member.toString() === id)) {
        return res.status(409).json({ error: 'User is not a team member' });
      }

      // Remove the user from the project's team
      req.project.team = req.project.team.filter(
        (member) => member.toString() !== id
      );
      await req.project.save();

      res.send('Team member removed successfully');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
}
