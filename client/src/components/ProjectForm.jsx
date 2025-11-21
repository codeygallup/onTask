export default function ProjectForm({ title, handleSub, project, setProject }) {
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await handleSub({
        variables: { ...project },
      });
      window.location.replace("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center border-2 border-slate-300 rounded-lg p-4 m-10 md:h-[calc(100vh-10rem)] bg-slate-50 mt-20">
        <div className="flex flex-col md:w-1/2">
          <form className="text-center" onSubmit={handleSubmit}>
            <h3 className="mb-5">{title}</h3>
            <label className="my-2">Title:</label>
            <br />
            <input
              name="title"
              type="text"
              onChange={handleFormChange}
              value={project.title}
              className="border-2 border-slate-300 rounded-md w-full p-2 bg-slate-100" 
              placeholder="Whats the projects title?"
              autoFocus
              required
            />
            <label className="my-3">Description:</label>
            <textarea
              name="description"
              type="text"
              onChange={handleFormChange}
              value={project.description}
              className="border-2 border-slate-300 rounded-md w-full p-2 bg-slate-100"
              placeholder="Describe what the purpose of the project is..."
              required
              rows="8"
            />
            <br />
            <button
              type="submit"
              className="border-2 border-slate-300 rounded-md py-2.5 px-4 mt-4"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
