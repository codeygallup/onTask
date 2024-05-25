const { AuthenticationError } = require("apollo-server-express");
const { User, Project, Task } = require("../models");
const { signToken } = require("../utils/auth");
const passwordRecover = require("../utils/passwordRecovery");
const bcrypt = require("bcrypt");

const resolvers = {
  Query: {
    me: async (_, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("Log in");
    },
    findUser: async (_, { _id }) => {
      return await User.findById(_id);
    },
    oneProject: async (_, { _id }) => {
      const project = await Project.findById(_id);
      const tasks = await Task.find({ taskProject: _id });
      project.tasks = tasks;

      return project;
    },
    userProjects: async (_, args, context) => {
      if (context.user) {
        return await Project.find({
          projectUser: context.user._id,
        });
      }
      throw new AuthenticationError("You need to be logged in");
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
    updateProject: async (_, { projectId, title, description }, context) => {
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
    requestPasswordRecovery: async (_, { email }) => {
      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      // Generate recovery pin and update user
      const resetPIN = Math.floor(100000 + Math.random() * 900000).toString();
      user.resetPIN = resetPIN;
      user.resetPINExpiry = Date.now() + 1800000; // PIN expires in 1 hour, change PIN to lesser

      await user.save();

      // Send recovery email
      passwordRecover(email, resetPIN);

      // Return an object with the token and user
      return {
        // token: userRecoveryToken, // Return the recovery token
        user: user, // Return the user object
      };
    },
    resetPassword: async (_, { email, newPassword }) => {
      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      user.password = newPassword;

      user.resetPIN = null;
      user.resetPINExpiry = null;
      await user.save();

      return {
        success: true,
        message: "Password reset successful",
      };
    },
    validatePIN: async (_, { email, pin }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      // Validate reset pin
      if (user.resetPIN !== pin || user.resetPINExpiry < Date.now()) {
        throw new Error("Invalid or expired PIN");
      }

      // Return success message if PIN is valid
      return {
        success: true,
        message: "PIN validation successful",
      };
    },
  },
};

module.exports = resolvers;
