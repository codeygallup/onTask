import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { USER_PROJECTS } from "../utils/queries";
import Auth from "../utils/auth";
import { ScaleLoader } from "react-spinners";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = () => {
  const { loading, data: { userProjects = [] } = {} } = useQuery(USER_PROJECTS);
  const totalTasks = userProjects.reduce(
    (acc, project) => acc + project.tasks.length,
    0
  );
  const completedTasks = userProjects.reduce(
    (acc, project) => acc + project.tasks.filter((t) => t.complete).length,
    0
  );

  const recentProjects = [...userProjects]
    .sort((a, b) => {
      const dateA = !isNaN(a.lastOpenedAt)
        ? new Date(Number(a.lastOpenedAt))
        : new Date(a.lastOpenedAt);
      const dateB = !isNaN(b.lastOpenedAt)
        ? new Date(Number(b.lastOpenedAt))
        : new Date(b.lastOpenedAt);

      return dateB - dateA;
    })
    .slice(0, 3);

  if (loading)
    return (
      <div
        className="text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        role="status"
        aria-live="polite"
        aria-label="Loading projects"
      >
        <ScaleLoader height={100} width={15} color="#1b89bc" />
      </div>
    );

  return (
    <>
      {!Auth.loggedIn() ? (
        <div className="flex h-full py-20 md:h-[calc(100vh-20rem)] w-full max-w-md mx-auto flex-col justify-center items-center mt-20">
          <div className="w-4/5 md:w-full border-2 border-slate-300 rounded-lg shadow-lg bg-white px-6 py-10 md:p-8">
            <h2 className="text-3xl font-bold mb-2 text-center">
              Welcome to OnTask!
            </h2>
            <p className="text-slate-600 text-center mb-8">
              Manage your projects efficiently
            </p>

            <div className="flex flex-col gap-4">
              <Link to="/login">
                <button className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg text-xl font-semibold hover:bg-teal-600 transition-colors">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="w-full border-2 border-teal-500 text-teal-500 py-3 px-4 rounded-lg text-xl font-semibold hover:bg-teal-50 transition-colors">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:h-[calc(100vh-5rem)] md:overflow-hidden overflow-auto">
          <main className="flex-1 p-4 flex flex-col gap-4">
            {totalTasks === 0 ? (
              <div className="text-center text-gray-500 mt-6 border-2 border-slate-300 bg-slate-100 rounded-lg p-4 flex flex-col gap-4">
                <p className="text-xl">No tasks yet!</p>
                <p className="text-sm mt-2">
                  Create a project and add your first task
                </p>
              </div>
            ) : (
              <div className="flex gap-4 justify-evenly">
                <div className="bg-slate-100 border-slate-300 w-1/3 h-24 flex flex-col justify-center items-center border-2 rounded-lg">
                  <h3 className="text-md md:text-base">Total Tasks</h3>
                  <h4 className="text-lg md:text-xl">
                    {completedTasks} / {totalTasks}
                  </h4>
                </div>
                <div className="bg-slate-100 border-slate-300 w-1/3 h-24 flex flex-col justify-center items-center border-2 rounded-lg">
                  <h3 className="text-md md:text-base">Progress</h3>
                  <h4 className="text-lg md:text-xl">
                    {totalTasks > 0
                      ? Math.round((completedTasks / totalTasks) * 100)
                      : 0}
                    %
                  </h4>
                </div>
              </div>
            )}

            <div className="flex-1 border-2 bg-slate-50 border-slate-300 rounded-lg p-4 flex flex-col">
              <h2 className="text-center text-2xl mb-4">Recent Projects</h2>
              <div className="flex-1 flex flex-col gap-8 justify-center">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <Link
                      to={`/project/${project._id}`}
                      key={project._id}
                      aria-label={`Open project ${project.title} - ${
                        project.tasks?.length || 0
                      } tasks, ${Math.round(
                        (project.tasks.filter((t) => t.complete).length /
                          project.tasks.length) *
                          100
                      )}% complete`}
                    >
                      <div className="md:h-28 border-2 bg-slate-100 border-slate-300 rounded p-4 flex gap-4 hover:bg-slate-200 hover:border-teal-400 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">
                            {project.title}
                          </h4>
                          <p className="text-slate-600">
                            {project.tasks?.length || 0} Tasks
                          </p>
                        </div>
                        <div className="w-32 flex flex-col justify-center">
                          <div
                            className="w-full bg-gray-200 rounded-full h-4 outline-1 outline-gray-400"
                            role="progressbar"
                            aria-valuenow={
                              project.tasks?.length
                                ? (project.tasks.filter((t) => t.complete)
                                    .length /
                                    project.tasks.length) *
                                  100
                                : 0
                            }
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-label="Project completion progress"
                          >
                            <div
                              className="bg-teal-500 h-4 rounded-full"
                              style={{
                                width: `${
                                  project.tasks?.length
                                    ? (project.tasks.filter((t) => t.complete)
                                        .length /
                                        project.tasks.length) *
                                      100
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-center text-sm text-slate-600 mt-1">
                            {project.tasks?.length
                              ? Math.round(
                                  (project.tasks.filter((t) => t.complete)
                                    .length /
                                    project.tasks.length) *
                                    100
                                )
                              : 0}
                            % Complete
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center text-gray-500">
                    <p className="text-xl">No recent projects</p>
                    <p className="text-sm mt-2">
                      Start by creating a new project!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
          <aside className="bg-slate-100 p-4 md:w-1/3 border-l-2 border-slate-300 flex flex-col border-t-2 md:border-t-0">
            <h2 className="text-center text-2xl border-b-2 border-b-slate-300">
              All Projects
            </h2>
            <div className="flex flex-col gap-2 my-4">
              {userProjects.map((project) => {
                return (
                  <p
                    className="border-2 border-slate-300 text-center rounded-md py-1.5 hover:bg-slate-200 hover:border-teal-400 transition-all duration-200"
                    key={project._id}
                  >
                    <Link
                      to={`/project/${project._id}`}
                      aria-label={`Open project: ${project.title}`}
                    >
                      {project.title}
                    </Link>
                  </p>
                );
              })}
            </div>
            <Link to="/project" className="mt-auto hidden md:block">
              <button
                className="border-2 border-teal-500 rounded-md py-2.5 w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold transition-colors"
                aria-label="Add new project"
              >
                Add Project
              </button>
            </Link>
          </aside>
        </div>
      )}
      <Link to="/project" className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition-colors"
          aria-label="Add new project"
        >
          <FontAwesomeIcon icon={faPlus} className="text-4xl" />
        </button>
      </Link>
    </>
  );
};

export default Home;
