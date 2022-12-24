import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { ADD_PROJECT } from "../utils/mutations";
import HomeButton from "../components/HomeButton";

const Project = () => {
  const [project, setProject] = useState({
    title: "",
    description: "",
  });

  const [addProject] = useMutation(ADD_PROJECT);

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
      window.location.replace("/");
    } catch (err) {
      console.error(err);
    }

    setProject({
      title: "",
      description: "",
    });
  };

  return (
    <>
      <Link to="/">
        <HomeButton />
      </Link>
      <form className="text-center projectForm" onSubmit={handleSubmit}>
        <h3 className="mb-5">Add New Project</h3>
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
        <button type="submit" className="btn">
          Add
        </button>
      </form>
    </>
  );
};

export default Project;
