import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { ONE_PROJECT, PROJECT_TASKS } from "../utils/queries";
import { REMOVE_PROJECT, ADD_TASK, REMOVE_TASK } from "../utils/mutations";
import { CardHeader, TaskInput, TaskItem, HomeButton } from "../components";

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
      <HomeButton />
      <div className="w-95 project-card">
        <div className="card">
          <CardHeader project={project} removeProject={removeProject} />
          <div className="task-grid">
            {taskOfProject.map((task) => {
              return (
                <TaskItem
                  key={task._id}
                  task={task}
                  refetch={refetch}
                  removeTask={removeTask}
                />
              );
            })}
          </div>
        </div>
        <TaskInput
          task={task}
          addTask={addTask}
          setTask={setTask}
          refetch={refetch}
          id={id}
        />
      </div>
    </>
  );
}

export default ProjectPage;
