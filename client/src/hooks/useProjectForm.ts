export const useProjectForm = ({
  handleSub,
  project,
  setProject,
}: {
  handleSub: (options: any) => Promise<void>;
  project: any;
  setProject: (project: any) => void;
}) => {
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      await handleSub({
        variables: { ...project },
      });
      window.location.replace("/");
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return { handleFormChange, handleSubmit };
};
