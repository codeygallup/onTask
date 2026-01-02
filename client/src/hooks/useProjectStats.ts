import { useMemo } from "react";
import type { Project, Task } from "../types";

// Helper function to parse date strings or timestamps
const parseDate = (dateValue: string | number | undefined): Date => {
  if (!dateValue) return new Date(0);
  return !isNaN(Number(dateValue))
    ? new Date(Number(dateValue))
    : new Date(dateValue);
};

// Calculate progress percentage for a single project
export const calculateProjectProgress = (project: Project): number => {
  if (!project.tasks?.length) return 0;

  const completed = project.tasks.filter((task: Task) => task.complete).length;
  return Math.round((completed / project.tasks.length) * 100);
};

export const useProjectStats = (projects: Project[]) => {
  // Calculate total tasks across all projects
  const totalTasks = useMemo((): number => {
    return projects.reduce((acc: number, project: Project) => {
      return acc + (project.tasks?.length || 0);
    }, 0);
  }, [projects]);

  // Calculate completed tasks across all projects
  const completedTasks = useMemo((): number => {
    return projects.reduce((acc: number, project: Project) => {
      const completedInProject =
        project.tasks?.filter((task: Task) => task.complete).length || 0;
      return acc + completedInProject;
    }, 0);
  }, [projects]);

  // Calculate progress percentage across all projects
  const progressPercentage = useMemo((): number => {
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  }, [totalTasks, completedTasks]);

  // Get the three most recently opened projects
  const recentProjects = useMemo((): Project[] => {
    return [...projects]
      .sort((a: Project, b: Project) => {
        // Handle both timestamp and date string formats for lastOpenedAt
        const dateA = parseDate(a.lastOpenedAt);
        const dateB = parseDate(b.lastOpenedAt);

        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 3);
  }, [projects]);

  return { totalTasks, completedTasks, recentProjects, progressPercentage };
};
