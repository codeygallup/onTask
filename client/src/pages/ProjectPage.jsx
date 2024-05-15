import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  COMPLETE_PROJECT_TASKS,
  INCOMPLETE_PROJECT_TASKS,
  ONE_PROJECT,
} from "../utils/queries";
import {
  REMOVE_PROJECT,
  ADD_TASK,
  REMOVE_TASK,
  UPDATE_COMPLETE,
} from "../utils/mutations";
import { CardHeader, TaskInput, TaskItem, HomeButton } from "../components";
import { TaskContext } from "../components/TaskContext";

function ProjectPage() {
  let { id } = useParams();

  const [task, setTask] = useState({
    taskText: "",
    complete: false,
    taskProject: id,
  });
  // const [tasks, setTasks] = useState([]);
  const [selectedOption, setSelectedOption] = useState("allTasks");

  const [addTask] = useMutation(ADD_TASK);
  const [removeTask] = useMutation(REMOVE_TASK);
  const [removeProject] = useMutation(REMOVE_PROJECT);
  const [updateComplete] = useMutation(UPDATE_COMPLETE);

  const { data: { oneProject = {} } = {}, refetch } = useQuery(ONE_PROJECT, {
    variables: { id: id },
  });

  // const { data: completedData, refetch: completeRefetch } = useQuery(
  //   COMPLETE_PROJECT_TASKS,
  //   {
  //     variables: { taskProject: id },
  //   }
  // );

  // const { data: incompleteData, refetch: incompleteRefetch } = useQuery(
  //   INCOMPLETE_PROJECT_TASKS,
  //   {
  //     variables: { taskProject: id },
  //   }
  // );

  const allTasks = useMemo(() => oneProject.tasks || [], [oneProject]);
  const completedTasks = useMemo(
    () => oneProject.tasks?.filter((task) => task.complete) || [],
    [oneProject]
  );
  const incompletedTasks = useMemo(
    () => oneProject.tasks?.filter((task) => !task.complete) || [],
    [oneProject]
  );

  // useEffect(() => {
  //   switch (selectedOption) {
  //     case "allTasks":
  //       setTasks(allTasks);
  //       break;
  //     case "completedTasks":
  //       setTasks(completedTasks);
  //       break;
  //     case "incompletedTasks":
  //       setTasks(incompletedTasks);
  //       break;
  //     default:
  //       setTasks(allTasks);
  //   }
  // }, [selectedOption, allTasks, completedTasks, incompletedTasks]);

  // useEffect(() => {
  //   setTasks(allTasks);
  // }, [allTasks, completedTasks, incompletedTasks]);

  const tasks = useMemo(() => {
    switch (selectedOption) {
      case "allTasks":
        return allTasks;
      case "completedTasks":
        return completedTasks;
      case "incompletedTasks":
        return incompletedTasks;
      default:
        return allTasks;
    }
  }, [selectedOption, allTasks, completedTasks, incompletedTasks]);

  const handleSelect = useCallback((e) => {
    setSelectedOption(e.target.value);
  }, []);

  return (
    <>
      <TaskContext.Provider
        value={{
          task,
          setTask,
          removeTask,
          addTask,
          updateComplete,
          refetch,
          setSelectedOption,
          selectedOption,
          handleSelect,
          id,
        }}
      >
        <HomeButton />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="shadow rounded">
            <CardHeader project={oneProject} removeProject={removeProject} />
            <div className="text-center d-flex justify-content-center fs-5">
              <select value={selectedOption} onChange={handleSelect}>
                <option value="allTasks">All Tasks</option>
                <option value="completedTasks">Completed Tasks</option>
                <option value="incompletedTasks">Incomplete Tasks</option>
              </select>
            </div>
            <div className="container vw-100">
              <div className="side overflow-y-scroll">
                {tasks.map((task) => (
                  <TaskItem key={task._id} task={task} />
                ))}
              </div>
              <TaskInput selectedOption={selectedOption} />
            </div>
          </div>
        </div>
      </TaskContext.Provider>
    </>
  );
}

export default ProjectPage;
