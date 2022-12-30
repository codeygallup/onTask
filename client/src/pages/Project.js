import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { ADD_PROJECT } from "../utils/mutations";
import HomeButton from "../components/HomeButton";
import ProjectForm from "../components/ProjectForm";

const Project = () => {
  const [project, setProject] = useState({
    title: "",
    description: "",
  });

  const [addProject] = useMutation(ADD_PROJECT);

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
      <ProjectForm
        title="Add New Project"
        handleSubmit={handleSubmit}
        project={project}
        setProject={setProject}
      />
    </>
  );
};

export default Project;