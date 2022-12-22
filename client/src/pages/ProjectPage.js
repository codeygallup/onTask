import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ONE_PROJECT, PROJECT_TASKS } from "../utils/queries";
import { REMOVE_PROJECT, ADD_TASK } from "../utils/mutations";

function ProjectPage() {
  let { id } = useParams();

  const [task, setTask] = useState({
    taskText: " ",
    complete: false,
    taskProject: id
  })

  console.log(task)

  const [addTask, { error }] = useMutation(ADD_TASK)

  const { data: taskData } = useQuery(PROJECT_TASKS, {
    variables: { taskProject: id }
  })
  console.log(taskData)

  const taskOfProject = taskData?.projectTasks || []
  console.log("TASK",taskOfProject)
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setTask({ ...task, [name]: value })
  }

  const handleTask = async (e) => {
    e.preventDefault()

    try {
      await addTask({
        variables: { ...task },
      })
      window.location.reload()
    } catch (err) {
      console.error(err)
    }

    setTask({
      taskText: " ",
      complete: false
    })
  }


  const { data } = useQuery(ONE_PROJECT, {
    variables: { id: id },
  });

  const project = data?.oneProject || [];

  // eslint-disable-next-line
  const [removeProject, { loading: removeLoading, data: removeData }] =
    useMutation(REMOVE_PROJECT);

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

  return (
    <>
      <Link to="/">
        <button className="btn btn-primary return">Home</button>
      </Link>
      {/* {!project.complete ? (
        <di className="App-header mx-5">NOT FINISHED</div>
      ) : (
        <h2 className="App-header mx-5">Finished. Ready to delete?</h2>
      )} */}
      <div className="text-center card w-95 pb-4">
        <div className="project-header">
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
        <p className="card-body">{project.description}</p>
        <p>Tasks:</p>
        {taskOfProject.map((task, index) => {
          return (
            <h1 key={index}>{task.taskText}</h1>
          )
        })}
        <div>
          <button className="btn btn-info mx-4" onClick={handleTask}>Add Task</button>
          <input name="taskText" onChange={handleFormChange} value={task.taskText} type="text" className="mx-4 my-4"></input>
        </div>
      </div>
    </>
  );
}

export default ProjectPage;
