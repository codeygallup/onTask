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
    completeProjectTasks: async (_, { taskProject }) => {
      return await Task.find({
        taskProject: taskProject,
        complete: true,
      });
    },
    incompleteProjectTasks: async (_, { taskProject }) => {
      return await Task.find({
        taskProject: taskProject,
        complete: false,
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
        throw new Error('User not found');
      }
    
      // Generate recovery token and update user
      const userRecoveryToken = await user.generateRecoveryToken();
      user.recoveryToken = userRecoveryToken;
      user.recoveryTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();
    
      // Send recovery email
      passwordRecover(email, userRecoveryToken);
    
      // Return an object with the token and user
      return {
        token: userRecoveryToken, // Return the recovery token
        user: user // Return the user object
      };
    },
    resetPassword: async (_, { email, token, newPassword }) => {
      // Find user by email
      const user = await User.findOne({ email });
    
      if (!user) {
        throw new Error('User not found');
      }
    
      // Validate recovery token
      if (user.recoveryToken !== token || user.recoveryTokenExpiry < Date.now()) {
        throw new Error('Invalid or expired token');
      }
    
      user.password = newPassword

      user.recoveryToken = null;
      user.recoveryTokenExpiry = null;
      await user.save();
    
      return {
        success: true,
        message: 'Password reset successful',
      };
    },
  },
};

module.exports = resolvers;
