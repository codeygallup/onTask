import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { UPDATE_PROJECT } from "../utils/mutations";
import { ProjectForm } from "../components";
import { useTask } from "../hooks/useTask";

function ProjectUpdate() {
  let { id } = useParams();

  const { project } = useTask(id);

  const [localProject, setLocalProject] = useState({
    projectId: id,
    title: "",
    description: "",
  });

  useEffect(() => {
    if (project?.title && !localProject.title) {
      setLocalProject({
        projectId: id,
        title: project.title,
        description: project.description,
      });
    }
  }, [project, localProject.title, id]);

  const [updateProject] = useMutation(UPDATE_PROJECT);

  return (
    <>
      <ProjectForm
        title="Update Project"
        handleSub={updateProject}
        project={localProject}
        setProject={setLocalProject}
      />
    </>
  );
}

export default ProjectUpdate;
