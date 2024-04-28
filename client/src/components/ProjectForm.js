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
      <div className="d-flex justify-content-center align-items-center vh-100 ">
        <div className="container shadow rounded p-5">
          <form className="text-center" onSubmit={handleSubmit}>
            <h3 className="mb-5">{title}</h3>
            <label className="my-2">Title:</label>
            <br />
            <input
              name="title"
              type="text"
              onChange={handleFormChange}
              value={project.title}
              className="form-control"
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
              className="form-control"
              placeholder="Describe what the purpose of the project is..."
              required
              rows="8"
            />
            <br />
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
