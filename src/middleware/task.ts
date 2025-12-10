import { Request, Response, NextFunction } from 'express';
import Task, { ITask } from '../models/Task';

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export const taskExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const taskBelongsToProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.task.project.toString() !== req.project.id.toString())
    // Verify task belongs to project. toString() to compare string with ObjectId
    return res
      .status(400)
      .json({ error: 'Task does not belong to this project' });
  next();
};

export const hasAuthorizationOnTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.project.manager.toString() !== req.user.id.toString())
    return res.status(403).json({ error: 'Unauthorized' });
  next();
};
