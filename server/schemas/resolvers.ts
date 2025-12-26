import { GraphQLError } from "graphql";
import { User, Project, Task } from "../models";
import { signToken } from "../utils/auth";
import passwordRecover from "../utils/passwordRecovery";
import {
  AddUserArgs,
  Context,
  EmailArgs,
  IdArgs,
  LoginArgs,
  ProjectArgs,
  ProjectIdArgs,
  ResetPasswordArgs,
  TaskArgs,
  TaskIdArgs,
  TaskIdsArgs,
  UpdateProjectArgs,
  ValidatePINArgs,
} from "../types";
import { IUser } from "../models/User";
import { IProject } from "../models/Project";
import { ITask } from "../models/Task";

const resolvers = {
  Query: {
    findUser: async (_: unknown, { _id }: IdArgs): Promise<IUser | null> => {
      return await User.findById(_id);
    },
    oneProject: async (
      _: unknown,
      { _id }: IdArgs
    ): Promise<IProject | null> => {
      return await Project.findByIdAndUpdate(
        _id,
        { lastOpenedAt: new Date().toISOString() },
        { new: true }
      ).populate("tasks");
    },
    userProjects: async (
      _: unknown,
      args: unknown,
      context: Context
    ): Promise<IProject[]> => {
      if (context.user) {
        const projects = await Project.find({
          userId: context.user._id,
        }).populate("tasks");

        return projects;
      }
      throw new GraphQLError("You need to be logged in", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    },
  },
  Mutation: {
    loginUser: async (_: unknown, { email, password }: LoginArgs) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new GraphQLError("Incorrect credentials", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!user || !correctPw) {
        throw new GraphQLError("Incorrect credentials", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const token = signToken({
        username: user.username,
        email: user.email,
        _id: user._id.toString(),
      });

      return { token, user };
    },
    addUser: async (_: unknown, { username, email, password }: AddUserArgs) => {
      const user = await User.create({ username, email, password });
      const token = signToken({
        username: user.username,
        email: user.email,
        _id: user._id.toString(),
      });
      return { token, user };
    },
    addProject: async (
      _: unknown,
      { title, description }: ProjectArgs,
      context: Context
    ): Promise<IProject> => {
      if (context.user) {
        return await Project.create({
          userId: context.user._id,
          title,
          description,
        });
      }

      throw new GraphQLError("You need to be logged in", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    },
    updateProject: async (
      _: unknown,
      { projectId, title, description }: UpdateProjectArgs,
      context: Context
    ): Promise<IProject | null> => {
      if (context.user) {
        return await Project.findByIdAndUpdate(
          projectId,
          {
            title,
            description,
            userId: context.user._id,
          },
          { new: true }
        );
      }
      throw new GraphQLError("You need to be logged in", {
        extensions: { code: "UNAUTHENTICATED" },
      });
      // throw new AuthenticationError("You need to be logged in");
    },
    updateLastOpened: async (
      _: unknown,
      { projectId }: ProjectIdArgs,
      context: Context
    ): Promise<IProject | null> => {
      if (context.user) {
        const project = await Project.findByIdAndUpdate(
          projectId,
          { lastOpenedAt: new Date().toISOString() },
          { new: true }
        ).populate("tasks");

        return project;
      }
      throw new GraphQLError("You need to be logged in", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    },
    removeProject: async (
      _: unknown,
      { projectId }: ProjectIdArgs
    ): Promise<IProject | null> => {
      return await Project.findByIdAndDelete(projectId);
    },
    addTask: async (
      _: unknown,
      { text, projectId }: TaskArgs,
      context: Context
    ): Promise<ITask> => {
      if (context.user) {
        const task = await Task.create({
          text,
          projectId,
        });

        await Project.findByIdAndUpdate(
          projectId,
          { $push: { tasks: task._id } },
          { new: true }
        );

        return task;
      }
      throw new GraphQLError("You need to be logged in", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    },
    removeTasks: async (_: unknown, { taskIds }: TaskIdsArgs) => {
      return await Task.deleteMany({ _id: { $in: taskIds } });
    },
    updateComplete: async (
      _: unknown,
      { taskId }: TaskIdArgs,
      context: Context
    ): Promise<ITask | null> => {
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
          throw err;
        }
      }
      throw new GraphQLError("You need to be logged in", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    },
    requestPasswordRecovery: async (_: unknown, { email }: EmailArgs) => {
      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      // Generate recovery pin and update user
      const resetPIN = Math.floor(100000 + Math.random() * 900000).toString();
      user.resetPIN = resetPIN;
      user.resetPINExpiry = new Date(Date.now() + 1800000); // 30 minutes

      await user.save();

      // Send recovery email
      passwordRecover(email, resetPIN);

      // Return an object with success, message, and user
      return {
        success: true,
        message: "Recovery PIN sent successfully",
        user: user,
      };
    },
    resetPassword: async (
      _: unknown,
      { email, newPassword }: ResetPasswordArgs
    ) => {
      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      user.password = newPassword;

      user.resetPIN = undefined;
      user.resetPINExpiry = undefined;
      await user.save();

      return {
        success: true,
        message: "Password reset successful",
      };
    },
    validatePIN: async (_: unknown, { email, pin }: ValidatePINArgs) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      // Validate reset pin
      if (
        user.resetPIN !== pin ||
        !user.resetPINExpiry ||
        user.resetPINExpiry < new Date()
      ) {
        throw new Error("Invalid or expired PIN");
      }

      // Return success message if PIN is valid
      return {
        success: true,
        message: "PIN validation successful",
      };
    },
    refreshToken: async (_: unknown, args: unknown, context: Context) => {
      if (context.user) {
        const newToken = signToken(context.user);
        return { token: newToken };
      }
      throw new GraphQLError("You need to be logged in", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    },
  },
};

export default resolvers;
