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
import {
  emailSchema,
  mongoIdSchema,
  newUserPasswordSchema,
  passwordSchema,
  pinSchema,
  projectDescriptionSchema,
  projectTitleSchema,
  taskTextSchema,
  usernameSchema,
} from "../validations";

const resolvers = {
  Query: {
    findUser: async (_: unknown, { _id }: IdArgs): Promise<IUser | null> => {
      const validId = mongoIdSchema.parse(_id);
      return await User.findById(validId);
    },
    oneProject: async (
      _: unknown,
      { _id }: IdArgs
    ): Promise<IProject | null> => {
      const validId = mongoIdSchema.parse(_id);
      // Update lastOpenedAt field to current date and time
      return await Project.findByIdAndUpdate(
        validId,
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
      const validEmail = emailSchema.parse(email);
      passwordSchema.parse(password);

      const user = await User.findOne({ email: validEmail });

      if (!user) {
        throw new GraphQLError("Incorrect credentials", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const correctPw = await user.isCorrectPassword(password);

      // Timing attack safe
      if (!user || !correctPw) {
        throw new GraphQLError("Incorrect credentials", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      // Create token
      const token = signToken({
        username: user.username,
        email: user.email,
        _id: user._id.toString(),
      });

      return { token, user };
    },
    addUser: async (_: unknown, { username, email, password }: AddUserArgs) => {
      const validUsername = usernameSchema.parse(username);
      const validEmail = emailSchema.parse(email);
      const validPassword = newUserPasswordSchema.parse(password);

      const user = await User.create({
        username: validUsername,
        email: validEmail,
        password: validPassword,
      });
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
        const validTitle = projectTitleSchema.parse(title);
        // Description is optional
        const validDescription = description
          ? projectDescriptionSchema.parse(description)
          : undefined;

        return await Project.create({
          userId: context.user._id,
          title: validTitle,
          description: validDescription,
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
        const validProjectId = mongoIdSchema.parse(projectId);
        const validTitle = projectTitleSchema.parse(title);
        // Description is optional
        const validDescription = description
          ? projectDescriptionSchema.parse(description)
          : undefined;

        // Update lastOpenedAt field to current date and time
        return await Project.findByIdAndUpdate(
          validProjectId,
          {
            title: validTitle,
            description: validDescription,
            userId: context.user._id,
          },
          { new: true }
        );
      }
      throw new GraphQLError("You need to be logged in", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    },
    updateLastOpened: async (
      _: unknown,
      { projectId }: ProjectIdArgs,
      context: Context
    ): Promise<IProject | null> => {
      if (context.user) {
        const validProjectId = mongoIdSchema.parse(projectId);

        // Update lastOpenedAt field to current date and time
        const project = await Project.findByIdAndUpdate(
          validProjectId,
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
      const validProjectId = mongoIdSchema.parse(projectId);
      return await Project.findByIdAndDelete(validProjectId);
    },
    addTask: async (
      _: unknown,
      { text, projectId }: TaskArgs,
      context: Context
    ): Promise<ITask> => {
      if (context.user) {
        const validText = taskTextSchema.parse(text);
        const validProjectId = mongoIdSchema.parse(projectId);

        const task = await Task.create({
          text: validText,
          projectId: validProjectId,
        });

        // Add task to project's tasks array
        await Project.findByIdAndUpdate(
          validProjectId,
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
      const validTaskIds = taskIds.map((id) => mongoIdSchema.parse(id));
      return await Task.deleteMany({ _id: { $in: validTaskIds } });
    },
    updateComplete: async (
      _: unknown,
      { taskId }: TaskIdArgs,
      context: Context
    ): Promise<ITask | null> => {
      if (context.user) {
        const validTaskId = mongoIdSchema.parse(taskId);
        try {
          const task = await Task.findById(validTaskId);
          if (!task) {
            throw new GraphQLError("Task not found", {
              extensions: { code: "NOT_FOUND" },
            });
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
      const validEmail = emailSchema.parse(email);
      // Find user by email
      const user = await User.findOne({ email: validEmail });

      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Generate recovery pin and update user
      const resetPIN = Math.floor(100000 + Math.random() * 900000).toString();
      user.resetPIN = resetPIN;
      user.resetPINExpiry = new Date(Date.now() + 1800000); // 30 minutes

      await user.save();

      // Send recovery email
      passwordRecover(validEmail, resetPIN);

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
      const validEmail = emailSchema.parse(email);
      const validPassword = passwordSchema.parse(newPassword);
      // Find user by email
      const user = await User.findOne({ email: validEmail });

      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      user.password = validPassword;

      user.resetPIN = undefined;
      user.resetPINExpiry = undefined;
      await user.save();

      return {
        success: true,
        message: "Password reset successful",
      };
    },
    validatePIN: async (_: unknown, { email, pin }: ValidatePINArgs) => {
      const validEmail = emailSchema.parse(email);
      const validPIN = pinSchema.parse(pin);

      const user = await User.findOne({ email: validEmail });

      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Validate reset pin and expiry
      if (
        user.resetPIN !== validPIN ||
        !user.resetPINExpiry ||
        user.resetPINExpiry < new Date()
      ) {
        throw new GraphQLError("Invalid or expired PIN", {
          extensions: { code: "BAD_USER_INPUT" },
        });
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
