import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { ADD_PROJECT } from "../utils/mutations";

const Project = () => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    complete: false,
  });

  // eslint-disable-next-line
  const [addProject, { error }] = useMutation(ADD_PROJECT);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addProject({
        variables: { ...project },
      });
      window.location.replace('/')
    } catch (err) {
      console.error(err);
    }

    setProject({
      title: "",
      description: "",
      complete: false,
    });

  };

  return (
    <>
      <form className="login text-center" onSubmit={handleSubmit}>
        <h3 className="mb-5">Add New Project</h3>
        <label className="mx-3">Title:</label>
        <input
          name="title"
          type="text"
          onChange={handleFormChange}
          value={project.title}
          required
        />
        <label className="mx-3">Description:</label>
        <input
          name="description"
          type="text"
          onChange={handleFormChange}
          value={project.description}
          className="mb-4"
          required
        /> 
        <br />
        <button type="submit" className="btn">
          Add
        </button>
      </form>
    </>
  );
};

export default Project;
