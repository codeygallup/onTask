import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { ONE_PROJECT, PROJECT_TASKS } from "../utils/queries";
import { REMOVE_PROJECT, ADD_TASK, REMOVE_TASK } from "../utils/mutations";
import { CardHeader, TaskInput, TaskItem, HomeButton } from "../components";
import { TaskContext } from "../components/TaskContext";

function ProjectPage() {
  let { id } = useParams();

  const [addTask] = useMutation(ADD_TASK);
  const [removeTask] = useMutation(REMOVE_TASK);
  const [removeProject] = useMutation(REMOVE_PROJECT);

  const { data: taskData, refetch } = useQuery(PROJECT_TASKS, {
    variables: { taskProject: id },
  });
  const taskOfProject = taskData?.projectTasks || [];

  const { data } = useQuery(ONE_PROJECT, {
    variables: { id: id },
  });
  const project = data?.oneProject || [];

  const [task, setTask] = useState({
    taskText: "",
    complete: false,
    taskProject: id,
  });

  return (
    <>
      <TaskContext.Provider
        value={{ task, setTask, removeTask, addTask, refetch, id }}
      >
        <HomeButton />
        <div className="d-flex justify-content-center align-items-center vh-100 ">
          <div className="shadow rounded">
            <CardHeader project={project} removeProject={removeProject} />
            <div className="container vw-100">
              <div className="task-grid">
                {taskOfProject.map((task) => {
                  return <TaskItem key={task._id} task={task} />;
                })}
              </div>
              <TaskInput />
            </div>
          </div>
        </div>
      </TaskContext.Provider>
    </>
  );
}

export default ProjectPage;
