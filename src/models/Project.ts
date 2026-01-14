import mongoose, { Schema, Document, Types, PopulatedDoc } from 'mongoose';
import Task, { ITask } from './Task';
import { IUser } from './User';
import Note from './Note';

// Define for TypeScript
export interface IProject extends Document {
  projectName: string;
  clientName: string;
  description: string;
  tasks: PopulatedDoc<ITask & Document>[]; // There are multiple tasks in a project in an array
  manager: PopulatedDoc<IUser & Document>;
  team: PopulatedDoc<IUser & Document>[];
}

// Define for Mongoose
const ProjectSchema: Schema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: [{ type: Types.ObjectId, ref: 'Task' }],
    manager: { type: Types.ObjectId, ref: 'User' },
    team: [{ type: Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Middleware
ProjectSchema.pre('deleteOne', { document: true }, async function () {
  const projectId = this._id;
  if (!projectId) return;

  const tasks = await Task.find({ project: projectId }); // deletes notes related to tasks in the project
  for (const task of tasks) {
    await Note.deleteMany({ task: task.id });
  }

  await Task.deleteMany({ project: projectId }); // deletes tasks related to the project
});

const Project = mongoose.model<IProject>('Project', ProjectSchema);
export default Project;
