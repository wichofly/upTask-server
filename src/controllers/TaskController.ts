import { Request, Response } from 'express';
import Task from '../models/Task';

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      task.project = req.project.id; // Associate task with the project
      req.project.tasks.push(task.id); // Add task to the project's tasks array
      await Promise.allSettled([task.save(), req.project.save()]);
      res.send('Task created successfully');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project.id });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
}
