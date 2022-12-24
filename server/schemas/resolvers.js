const { AuthenticationError } = require("apollo-server-express");
const { User, Project, Task } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("Log in");
    },
    oneProject: async (parent, { _id }) => {
      return await Project.findOne({ _id });
    },
    userProjects: async (parent, args, context) => {
      if (context.user) {
        return await Project.find({
          projectUser: context.user._id,
        });
      }
      throw new AuthenticationError("You need to be logged in");
    },
    projectTasks: async (parent, { taskProject }) => {
        return await Task.find({
          taskProject: taskProject,
        })
    }
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      const correctPw = await user.isCorrectPassword(password);

      if (!user || !correctPw) {
        throw new AuthenticationError("Incorrect credentials");
        window.alert('Invalid')
      }

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    addProject: async (parent, { title, description }, context) => {
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
      parent,
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
    removeProject: async (parent, { projectId }) => {
      return await Project.findByIdAndDelete(projectId);
    
    },
    addTask: async (parent, { taskText, taskProject }, context) => {
      if (context.user) {
        return await Task.create({
          taskText,
          taskProject
        })
      }
      throw new AuthenticationError("You need to be logged in")
    },
    removeTask: async (parent, { taskId }) => {
      return await Task.findByIdAndDelete(taskId)
    }
  },
};

module.exports = resolvers;