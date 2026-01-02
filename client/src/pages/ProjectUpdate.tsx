import ProjectForm from "../components/ProjectForm";
import { useProjectUpdate } from "../hooks/useProjectUpdate";

const ProjectUpdate = () => {
  const { localProject, setLocalProject, updateProject } = useProjectUpdate();

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
