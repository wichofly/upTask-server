import { Request, Response } from 'express';
import Project from '../models/Project';

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);

    project.manager = req.user.id; // Assign the authenticated user's ID as the manager

    try {
      await project.save();
      res.send('Project created successfully');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [{ manager: { $in: req.user.id } }], // Include projects managed by the user
      });
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

      if (project.manager.toString() !== req.user.id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }

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

      if (project.manager.toString() !== req.user.id.toString()) {
        return res
          .status(403)
          .json({ error: 'Only the manager can update the project' });
      }

      project.projectName = req.body.projectName;
      project.clientName = req.body.clientName;
      project.description = req.body.description;
      await project.save();
      res.send('Project updated successfully');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const project = await Project.findById(id);

      if (!project) return res.status(404).json({ error: 'Project not found' });

      if (project.manager.toString() !== req.user.id.toString()) {
        return res
          .status(403)
          .json({ error: 'Only the manager can delete the project' });
      }

      await project.deleteOne();
      res.send('Project deleted successfully');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
}
