import { useState } from "react";

export default function ProjectForm({ title, handleSub, project, setProject }) {
  const [isFocused, setIsFocused] = useState(false);

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
      <div className="mx-10 my-40 flex items-center justify-center rounded-lg border-slate-300 bg-slate-50 px-4 shadow md:mx-auto md:mt-10 md:h-[calc(100vh-10rem)] md:min-h-0 md:w-1/2 md:border-2 md:p-10 md:shadow-none">
        <div className="flex h-full w-full flex-col">
          <form
            className="flex h-full flex-col justify-between py-4 text-center"
            onSubmit={handleSubmit}
          >
            <div className="mb-12 md:mb-0">
              <h3 className="text-2xl font-bold">{title}</h3>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-6">
              <div className="relative">
                <input
                  id="project-title"
                  name="title"
                  type="text"
                  onChange={handleFormChange}
                  value={project.title}
                  className="floating-label-input peer w-full rounded border-2 border-slate-300 bg-slate-100 px-4 py-2 focus:border-teal-500 focus:outline-none"
                  placeholder=" "
                  autoFocus
                  required
                />
                <label
                  htmlFor="project-title"
                  className="floating-label pointer-events-none absolute left-4 text-gray-500 transition-all duration-300 ease-in-out"
                  data-label="Title"
                  data-placeholder="Write your project title..."
                ></label>
              </div>

              <div className="relative mt-4">
                <textarea
                  id="project-description"
                  name="description"
                  onChange={handleFormChange}
                  value={project.description}
                  className="floating-label-input peer w-full resize-none rounded border-2 border-slate-300 bg-slate-100 px-4 py-2 focus:border-teal-500 focus:outline-none"
                  placeholder=" "
                  required
                  rows="8"
                />
                <label
                  htmlFor="project-description"
                  className="floating-label pointer-events-none absolute left-4 text-gray-500 transition-all duration-300 ease-in-out"
                  data-label="Description"
                  data-placeholder="Describe the purpose of the project..."
                ></label>
              </div>
            </div>

            <div className="mt-8 md:mt-0">
              <button
                type="submit"
                className="w-full rounded-md border-2 border-teal-500 bg-teal-500 px-4 py-2.5 font-semibold text-white transition-colors hover:border-teal-600 hover:bg-teal-600"
              >
                Add Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
