import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { ADD_TASK, REMOVE_TASKS, UPDATE_COMPLETE } from "../utils/mutations";
import { ONE_PROJECT } from "../utils/queries";
import type {
  AddTaskVariables,
  OneProjectData,
  OneProjectVariables,
  Project,
  RemoveTasksVariables,
  TaskFormData,
  UpdateCompleteVariables,
} from "../types";

export function useTask(projectId: string) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("allTasks");

  const [addTask] = useMutation<any, AddTaskVariables>(ADD_TASK);
  const [removeTasks] = useMutation<any, RemoveTasksVariables>(REMOVE_TASKS);
  const [updateComplete] = useMutation<any, UpdateCompleteVariables>(
    UPDATE_COMPLETE
  );

  const { data, refetch } = useQuery<OneProjectData, OneProjectVariables>(
    ONE_PROJECT,
    {
      variables: { id: projectId },
    }
  );

  const oneProject = data?.oneProject || ({} as Project);
  const tasks = useMemo(() => oneProject.tasks || [], [oneProject.tasks]);

  const filteredTasks = useMemo(() => {
    switch (selectedOption) {
      case "completedTasks":
        return tasks.filter((task) => task.complete);
      case "incompletedTasks":
        return tasks.filter((task) => !task.complete);
      default:
        return tasks;
    }
  }, [selectedOption, tasks]);

  const handleDeleteSelectedTasks = useCallback(async () => {
    try {
      await removeTasks({
        variables: { taskIds: selectedTasks },
      });
      await refetch();
      setSelectedOption("allTasks");
      setSelectedTasks([]);
    } catch (err) {
      console.error(err);
    }
  }, [removeTasks, refetch, selectedTasks]);

  const handleAddTask = useCallback(
    async (taskData: TaskFormData) => {
      try {
        await addTask({
          variables: { text: taskData.text, projectId },
        });
        await refetch();
      } catch (err) {
        console.error(err);
      }
    },
    [addTask, refetch, projectId]
  );

  return {
    selectedTasks,
    setSelectedTasks,
    selectedOption,
    setSelectedOption,
    handleDeleteSelectedTasks,
    handleAddTask,
    updateComplete,
    refetch,
    tasks: oneProject.tasks || [],
    project: oneProject,
    filteredTasks,
  };
}
