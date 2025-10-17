import { Request, Response } from 'express';
import Project from '../models/Project';

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);

    try {
      await project.save();
      res.json({ message: 'Project created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({}); // Fetch all projects
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const project = await Project.findById(id).populate('tasks');

      if (!project) return res.status(404).json({ error: 'Project not found' });
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const project = await Project.findById(id);

      if (!project) return res.status(404).json({ error: 'Project not found' });

      project.projectName = req.body.projectName;
      project.clientName = req.body.clientName;
      project.description = req.body.description;
      await project.save();
      res.json({ message: 'Project updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const project = await Project.findById(id);

      if (!project) return res.status(404).json({ error: 'Project not found' });
      await project.deleteOne();
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
}
