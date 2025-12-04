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
      <div className="flex justify-center items-center md:min-h-0 md:h-[calc(100vh-10rem)] bg-slate-50 md:mt-10 md:w-1/2 md:mx-auto md:p-10 shadow md:border-2 border-slate-300 rounded-lg px-4 mx-10 my-40">
        <div className="flex flex-col w-full h-full">
          <form
            className="text-center flex flex-col h-full justify-between py-4"
            onSubmit={handleSubmit}
          >
            <div className="mb-12 md:mb-0">
              <h3 className="text-2xl font-bold">{title}</h3>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6">
              <div className="relative">
                <input
                  id="project-title"
                  name="title"
                  type="text"
                  onChange={handleFormChange}
                  value={project.title}
                  className="floating-label-input peer w-full px-4 py-2 border-2 rounded focus:outline-none focus:border-teal-500 border-slate-300 bg-slate-100"
                  placeholder=" "
                  autoFocus
                  required
                />
                <label
                  htmlFor="project-title"
                  className="floating-label absolute left-4 text-gray-500 transition-all duration-300 ease-in-out pointer-events-none"
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
                  className="floating-label-input peer w-full px-4 py-2 border-2 rounded focus:outline-none focus:border-teal-500 border-slate-300 bg-slate-100 resize-none"
                  placeholder=" "
                  required
                  rows="8"
                />
                <label
                  htmlFor="project-description"
                  className="floating-label absolute left-4 text-gray-500 transition-all duration-300 ease-in-out pointer-events-none"
                  data-label="Description"
                  data-placeholder="Describe the purpose of the project..."
                ></label>
              </div>
            </div>

            <div className="mt-8 md:mt-0">
              <button
                type="submit"
                className="border-2 border-teal-500 bg-teal-500 text-white rounded-md py-2.5 px-4 hover:bg-teal-600 hover:border-teal-600 transition-colors w-full font-semibold"
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
