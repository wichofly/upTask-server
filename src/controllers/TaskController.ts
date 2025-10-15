import { Request, Response } from 'express';
import Project from '../models/Project';
import Task from '../models/Task';

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).send({ error: 'Project not found' });

    try {
      const task = new Task(req.body);
      task.project = project.id; // Associate task with the project
      project.tasks.push(task.id); // Add task to the project's tasks array
      await task.save();
      await project.save();
      res.send('Task created successfully');
    } catch (error) {
      console.log(error);
    }
  };
}
