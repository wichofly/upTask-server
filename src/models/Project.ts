import mongoose, { Schema, Document } from 'mongoose';

// Define for TypeScript
export interface IProject extends Document {
  projectName: string;
  clientName: string;
  description: string;
}

// Define for Mongoose
const ProjectSchema: Schema = new Schema({
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
});

const Project = mongoose.model<IProject>('Project', ProjectSchema);
export default Project;
