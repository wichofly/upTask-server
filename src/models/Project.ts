import mongoose, { Schema, Document, Types, PopulatedDoc } from 'mongoose';
import { ITask } from './Task';

// Define for TypeScript
export interface IProject extends Document {
  projectName: string;
  clientName: string;
  description: string;
  tasks: PopulatedDoc<ITask & Document>[]; // There are multiple tasks in a project in an array
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
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

const Project = mongoose.model<IProject>('Project', ProjectSchema);
export default Project;
