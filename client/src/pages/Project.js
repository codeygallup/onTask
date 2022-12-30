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

  return (
    <>
      <Link to="/">
        <HomeButton />
      </Link>
      <ProjectForm
        title="Add New Project"
        handleSub={addProject}
        project={project}
        setProject={setProject}
      />
    </>
  );
};

export default Project;
