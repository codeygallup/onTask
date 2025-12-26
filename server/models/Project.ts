import { Document, Model, Schema, model } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  userId: Schema.Types.ObjectId | string;
  tasks: Schema.Types.ObjectId[];
  lastOpenedAt: Date;
}

export interface IProjectModel extends Model<IProject> {}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    lastOpenedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Project = model<IProject, IProjectModel>("Project", projectSchema);

export default Project;
