import { Schema, model, Document, Model } from "mongoose";

export interface ITask extends Document {
  text: string;
  complete: boolean;
  projectId: Schema.Types.ObjectId | string;
}

export interface ITaskModel extends Model<ITask> {}

const taskSchema = new Schema<ITask>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = model<ITask, ITaskModel>("Task", taskSchema);

export default Task;
