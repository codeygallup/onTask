import { useCallback } from "react";
import { REMOVE_PROJECT } from "../utils/mutations";
import { useMutation } from "@apollo/client";

export function useProject() {
  const [removeProject] = useMutation(REMOVE_PROJECT);

  const handleDeleteProject = useCallback(
    async ({ variables: { projectId } }) => {
      try {
        await removeProject({
          variables: { projectId },
        });
      } catch (err) {
        console.error(err);
      }
    },
    [removeProject]
  );

  return {
    handleDeleteProject,
  };
}
