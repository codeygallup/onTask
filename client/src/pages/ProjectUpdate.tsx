import { useParams } from "react-router-dom";
import { useTask } from "../hooks/useTask";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_PROJECT } from "../utils/mutations";
import ProjectForm from "../components/ProjectForm";
import type { ProjectInput } from "../types";

const ProjectUpdate = () => {
  let { id } = useParams<{ id: string }>();

  const { project } = useTask(id!);

  const [localProject, setLocalProject] = useState<ProjectInput>({
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
};

export default ProjectUpdate;
