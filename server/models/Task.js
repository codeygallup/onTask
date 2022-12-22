const { Schema, model } = require("mongoose");

const taskSchema = new Schema({
  taskText: {
    type: String,
    required: true,
  },
  complete: {
    type: Boolean,
  },
  taskProject: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

const Task = model("Task", taskSchema);

module.exports = Task;
