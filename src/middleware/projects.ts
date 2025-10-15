import { Request, Response, NextFunction } from 'express';
import Project from '../models/Project';

export const validateProjectExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
