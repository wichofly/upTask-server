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
    try {
      const task = await Task.findById(req.task.id)
        .populate({
          path: 'completedBy.user',
          select: 'id name email',
        })
        .populate({
          path: 'notes',
          populate: { path: 'createdBy', select: 'id name email' }, // Nested populate to get note creators
        });

      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      req.task.name = req.body.name;
      req.task.description = req.body.description;
      await req.task.save();
      res.send('Task updated successfully');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static deleteTask = async (req: Request, res: Response) => {
    try {
      // Remove task from project's tasks array
      req.project.tasks = req.project.tasks.filter(
        (t) => t.toString() !== req.task.id.toString()
      );

      // Delete task and save updated project simultaneously
      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);

      res.send('Task deleted successfully');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static updateTaskStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      req.task.status = status;

      const data = {
        user: req.user.id, // Assuming req.user contains the authenticated user
        status,
      };

      req.task.completedBy.push(data); // Append to completedBy array

      await req.task.save();
      res.send('Task status updated successfully');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
}
