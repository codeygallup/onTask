import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { ONE_PROJECT, PROJECT_TASKS } from "../utils/queries";
import { REMOVE_PROJECT, ADD_TASK, REMOVE_TASK } from "../utils/mutations";
import TaskItem from "../components/TaskItem";
import HomeButton from "../components/HomeButton";

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleTask = async (e) => {
    e.preventDefault();

    try {
      await addTask({
        variables: { ...task },
      });
    } catch (err) {
      console.error(err);
    }

    setTask({
      taskText: "",
      complete: false,
    });
  };

  const handleDelete = async (e, projectId) => {
    e.preventDefault();

    try {
      await removeProject({
        variables: { projectId },
      });
      window.location.replace("/");
    } catch (err) {
      console.error(err);
    }
  };

  const taskDelete = async (e, taskId) => {
    e.preventDefault();

    try {
      await removeTask({
        variables: { taskId },
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    refetch();
    // eslint-disable-next-line
  }, [handleTask, taskDelete]);

  return (
    <>
      <Link to="/" className="mb-4">
        <HomeButton />
      </Link>
      <div className="w-95 project-card">
        <div className="card">
          <div className="project-header text-center">
            <Link to={`/project/${project._id}/update`}>
              <button className="btn btn-link edit-btn">Edit</button>
            </Link>
            <h1 className="card card-header">{project.title}</h1>
            <button
              className="btn btn-danger"
              onClick={(e) => handleDelete(e, project._id)}
            >
              Delete
            </button>
          </div>
          <details className="card-body text-center mb-4">
            <summary className="float-right">Project description</summary>
            <p>{project.description}</p>
          </details>
          <h5 className="text-center">Tasks:</h5>
          <div className="task-grid">
            {taskOfProject.map((task) => {
              return (
                <TaskItem key={task._id} task={task} taskDelete={taskDelete} />
              );
            })}
          </div>
        </div>
        <div className="text-center">
          <input
            placeholder="Enter task..."
            name="taskText"
            onChange={handleFormChange}
            value={task.taskText}
            type="text"
            className="mx-4 my-4 btn"
            style={{ marginRight: "10px" }}
          ></input>
          <button className="btn btn-info mx-4" onClick={handleTask}>
            Add Task
          </button>
        </div>
      </div>
    </>
  );
}

export default ProjectPage;
