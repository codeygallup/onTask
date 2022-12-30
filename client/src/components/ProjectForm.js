export default function ProjectForm({
  title,
  handleSubmit,
  project,
  setProject,
}) {
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };
  return (
    <>
      <form className="text-center projectForm" onSubmit={handleSubmit}>
        <h3 className="mb-5">{title}</h3>
        <label className="mx-3">Title:</label>
        <br />
        <input
          name="title"
          type="text"
          onChange={handleFormChange}
          value={project.title}
          className="inputBox"
          required
        />
        <br />
        <label className="mx-3">Description:</label>
        <br />
        <textarea
          name="description"
          type="text"
          onChange={handleFormChange}
          value={project.description}
          className="inputBox"
          required
          rows="8"
        />
        <br />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
    </>
  );
}