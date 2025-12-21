import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { ADD_PROJECT } from "../utils/mutations";
import ProjectForm from "../components/ProjectForm";
import type { ProjectInput } from "../types";

const Project = () => {
  const [project, setProject] = useState<ProjectInput>({
    title: "",
    description: "",
  });

  const [addProject] = useMutation(ADD_PROJECT);

  return (
    <>
      <ProjectForm
        title="Add new Project"
        handleSub={addProject}
        project={project}
        setProject={setProject}
      />
    </>
  );
};

export default Project;
