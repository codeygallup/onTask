import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { UPDATE_PROJECT } from "../utils/mutations";
import { ONE_PROJECT } from "../utils/queries";

function ProjectUpdate() {
  let { id } = useParams();

  const { loading, data } = useQuery(ONE_PROJECT, {
    variables: { id: id },
  });

  const projectData = data?.oneProject || [];

  const [project, setProject] = useState({
    projectId: id,
    title: projectData.title,
    description: projectData.description,
    complete: false,
  });

  const [updateProject, { error }] = useMutation(UPDATE_PROJECT);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProject({
        variables: { ...project },
      });
      window.location.replace("/");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <form className="text-center projectForm" onSubmit={handleSubmit}>
      <Link to="/">
        <button className="btn btn-primary return">Home</button>
      </Link>
        <h3 className="mb-5">Update Project</h3>
        <label className="mx-3">Title:</label>
        <br />
        <input
          name="title"
          type="text"
          onChange={handleFormChange}
          value={project.title}
          className="inputBox"
          required
        />
        <br />
        <label className="mx-3">Description:</label>
        <br />
        <textarea
          name="description"
          type="text"
          onChange={handleFormChange}
          value={project.description}
          className="inputBox"
          required
          rows="15"
        />
        <br />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
    </>
  );
}

export default ProjectUpdate;
