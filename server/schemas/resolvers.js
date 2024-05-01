const { AuthenticationError } = require("apollo-server-express");
const { User, Project, Task } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (_, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("Log in");
    },
    oneProject: async (_, { _id }) => {
      return await Project.findOne({ _id });
    },
    userProjects: async (_, args, context) => {
      if (context.user) {
        return await Project.find({
          projectUser: context.user._id,
        });
      }
      throw new AuthenticationError("You need to be logged in");
    },
    projectTasks: async (_, { taskProject }) => {
      return await Task.find({
        taskProject: taskProject,
      });
    },
  },
  Mutation: {
    loginUser: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      const correctPw = await user.isCorrectPassword(password);

      if (!user || !correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    addProject: async (_, { title, description }, context) => {
      if (context.user) {
        return await Project.create({
          projectUser: context.user._id,
          title,
          description,
        });
      }
      throw new AuthenticationError(
        "You need to be logged in to add a project"
      );
    },
    updateProject: async (
      _,
      { projectId, title, description },
      context
    ) => {
      if (context.user) {
        return await Project.findByIdAndUpdate(
          projectId,
          {
            title,
            description,
            projectUser: context.user._id,
          },
          { new: true }
        );
      }
    },
    removeProject: async (_, { projectId }) => {
      return await Project.findByIdAndDelete(projectId);
    },
    addTask: async (_, { taskText, taskProject }, context) => {
      if (context.user) {
        return await Task.create({
          taskText,
          taskProject,
        });
      }
      throw new AuthenticationError("You need to be logged in");
    },
    removeTask: async (_, { taskId }) => {
      return await Task.findByIdAndDelete(taskId);
    },
    updateComplete: async (_, { taskId }, context) => {
      if (context.user) {
        try {
          const task = await Task.findById(taskId);
          if (!task) {
            throw new Error("Task not found");
          }
          task.complete = !task.complete;
          await task.save();
          return task;
        } catch (err) {
          console.error(err);
        }
      }
    },
  },
};

module.exports = resolvers;
