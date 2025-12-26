import { z } from "zod";

export const emailSchema = z.string().email().toLowerCase();

export const passwordSchema = z
  .string()
  .min(1, "Password must be at least 8 characters long")
  .max(80, "Password is too long");

export const usernameSchema = z
  .string()
  .min(1, "Username must be at least 3 characters long")
  .max(30, "Username is too long")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  );

export const projectTitleSchema = z
  .string()
  .min(1, "Project title must be at least 3 characters long")
  .max(100, "Project title is too long")
  .trim();

export const projectDescriptionSchema = z
  .string()
  .max(500, "Project description is too long")
  .trim()
  .optional();

export const taskTextSchema = z
  .string()
  .min(1, "Task text cannot be empty")
  .max(300, "Task text is too long")
  .trim();

export const pinSchema = z
  .string()
  .regex(/^(\d{6})$/, "PIN must be a 6-digit number");

export const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");
