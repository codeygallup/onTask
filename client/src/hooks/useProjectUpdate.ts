import { useParams } from "react-router-dom";
import { useTask } from "./useTask";
import { useEffect, useState } from "react";
import type { ProjectInput } from "../types";
import { useMutation } from "@apollo/client/react";
import { UPDATE_PROJECT } from "../utils/mutations";

export const useProjectUpdate = () => {
  let { id } = useParams<{ id: string }>();

  const { project } = useTask(id!); // Non-null assertion since id is required here

  const [localProject, setLocalProject] = useState<ProjectInput>({
    projectId: id,
    title: "",
    description: "",
  });

  // Populate local state when project data is available
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

  return { localProject, setLocalProject, updateProject };
};
