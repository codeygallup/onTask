import { useMutation } from "@apollo/client/react";
import { useCallback } from "react";
import { REMOVE_PROJECT } from "../utils/mutations";

interface DeleteProjectVariables {
  projectId: string;
}

export function useProject() {
  const [removeProject] = useMutation<any, DeleteProjectVariables>(
    REMOVE_PROJECT
  );

  const handleDeleteProject = useCallback(
    async ({ variables }: { variables: DeleteProjectVariables }) => {
      try {
        await removeProject({
          variables: { projectId: variables.projectId },
        });
      } catch (err) {
        console.error("Error deleting project:", err);
      }
    },
    [removeProject]
  );

  return {
    handleDeleteProject,
  };
}
