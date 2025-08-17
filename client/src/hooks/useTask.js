import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useMemo, useState } from "react";
import { ADD_TASK, REMOVE_TASKS, UPDATE_COMPLETE } from "../utils/mutations";
import { ONE_PROJECT } from "../utils/queries";

export function useTask(projectId) {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedOption, setSelectedOption] = useState("allTasks");

  const [addTask] = useMutation(ADD_TASK);
  const [removeTasks] = useMutation(REMOVE_TASKS);
  const [updateComplete] = useMutation(UPDATE_COMPLETE);

  const { data: { oneProject = {} } = {}, refetch } = useQuery(ONE_PROJECT, {
    variables: { id: projectId },
  });

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
    async (taskData) => {
      try {
        await addTask({
          variables: { ...taskData, projectId },
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
