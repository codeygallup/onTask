import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { UPDATE_PROJECT } from "../utils/mutations";
import { ONE_PROJECT } from "../utils/queries";
import { HomeButton, ProjectForm } from "../components";

function ProjectUpdate() {
  let { id } = useParams();

  const { data } = useQuery(ONE_PROJECT, {
    variables: { id: id },
  });

  const projectData = data?.oneProject || [];

  const [project, setProject] = useState({
    projectId: id,
    title: projectData.title,
    description: projectData.description,
  });

  const [updateProject] = useMutation(UPDATE_PROJECT);

  return (
    <>
      <HomeButton />
      <ProjectForm
        title="Update Project"
        handleSub={updateProject}
        project={project}
        setProject={setProject}
      />
    </>
  );
}

export default ProjectUpdate;
