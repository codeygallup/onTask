import { useParams } from "react-router-dom";
import { useTask } from "./useTask";
import { useEffect, useRef, useState } from "react";
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
  const initialized = useRef(false);

  useEffect(() => {
    if (project && !initialized.current) {
      setLocalProject({
        projectId: id,
        title: project.title,
        description: project.description,
      });
      initialized.current = true;
    }
  }, [project, id]);

  const [updateProject] = useMutation(UPDATE_PROJECT);

  return { localProject, setLocalProject, updateProject };
};
