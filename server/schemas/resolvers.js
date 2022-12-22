const { AuthenticationError } = require("apollo-server-express");
const { User, Project, Task } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const myData = await User.findOne({ _id: context.user._id });
        return myData;
      }
      throw new AuthenticationError("Log in");
    },
    allProjects: async (parent, args, context) => {
      if (context.user) {
        const projectData = await Project.find({});
        return projectData;
      }
      throw new AuthenticationError("You need to be logged in");
    },
    oneProject: async (parent, { _id }) => {
      const projectData = await Project.findOne({ _id });
      return projectData;
    },
    userProjects: async (parent, args, context) => {
      if (context.user) {
        const userProjectData = await Project.find({
          projectUser: context.user._id,
        });
        return userProjectData;
      }
      throw new AuthenticationError("You need to be logged in");
    },
    projectTasks: async (parent, { taskProject }) => {
        const projectTaskData = await Task.find({
          taskProject: taskProject,
        })
        return projectTaskData
    }
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
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
        const project = await Project.create({
          projectUser: context.user._id,
          title,
          description,
        });
        return project;
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
        const projectUpdate = await Project.findByIdAndUpdate(
          projectId,
          {
            title,
            description,
            projectUser: context.user._id,
          },
          { new: true }
          );
        return projectUpdate;
      }
    },
    removeProject: async (parent, args) => {
      const { projectId } = args;
      const projectDelete = await Project.findByIdAndDelete(projectId);
      return projectDelete;
    },
    addTask: async (parent, { taskText, taskProject }, context) => {
      if (context.user) {
        const task = await Task.create({
          taskText,
          taskProject
        })
        return task
      }
      throw new AuthenticationError("You need to be logged in")
    }
  },
};

module.exports = resolvers;