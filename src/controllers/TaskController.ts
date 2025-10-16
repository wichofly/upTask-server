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
      const tasks = await Task.find({ project: req.project.id }).populate(
        'project'
      );
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    const { taskId } = req.params;

    try {
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      if (task.project.toString() !== req.project.id) // Verify task belongs to project. toString() to compare string with ObjectId
        return res
          .status(400)
          .json({ error: 'Task does not belong to this project' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
}
