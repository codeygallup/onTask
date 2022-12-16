import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { ONE_PROJECT } from "../utils/queries";
import { REMOVE_PROJECT } from "../utils/mutations";

function ProjectPage() {
  let { id } = useParams();

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
        <div className="App-header mx-5">NOT FINISHED</div>
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
        <div>
          <button className="btn btn-info mx-4">Add Task</button>
          <input type="text" className="mx-4 my-4"></input>
        </div>
      </div>
    </>
  );
}

export default ProjectPage;
