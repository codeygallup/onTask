import { useQuery } from "@apollo/client/react";
import { USER_PROJECTS } from "../utils/queries";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import Auth from "../utils/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import type { Project, Task, UserProjectsData } from "../types";

const Home = () => {
  const { loading, data } = useQuery<UserProjectsData>(USER_PROJECTS);
  const userProjects: Project[] = data?.userProjects || [];

  const totalTasks = useMemo((): number => {
    return userProjects.reduce((acc: number, project: Project) => {
      return acc + (project.tasks?.length || 0);
    }, 0);
  }, [userProjects]);

  const completedTasks = useMemo((): number => {
    return userProjects.reduce((acc: number, project: Project) => {
      const completedInProject =
        project.tasks?.filter((task: Task) => task.complete).length || 0;
      return acc + completedInProject;
    }, 0);
  }, [userProjects]);

  const recentProjects = useMemo((): Project[] => {
    return [...userProjects]
      .sort((a: Project, b: Project) => {
        const dateA: Date = a.lastOpenedAt
          ? !isNaN(Number(a.lastOpenedAt))
            ? new Date(Number(a.lastOpenedAt))
            : new Date(a.lastOpenedAt)
          : new Date(0);
        const dateB: Date = b.lastOpenedAt
          ? !isNaN(Number(b.lastOpenedAt))
            ? new Date(Number(b.lastOpenedAt))
            : new Date(b.lastOpenedAt)
          : new Date(0);

        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 3);
  }, [userProjects]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-4xl animate-spin"></div>
      </div>
    );

  return (
    <>
      {!Auth.loggedIn() ? (
        <div className="mx-auto mt-20 flex h-full w-full max-w-md flex-col items-center justify-center py-20 md:h-[calc(100vh-20rem)]">
          <div className="w-4/5 rounded-lg border-0 bg-white px-6 py-10 shadow-xl md:w-full md:border-2 md:border-slate-300 md:p-8 md:shadow-lg">
            <h2 className="mb-2 text-center text-3xl font-bold">
              Welcome to OnTask!
            </h2>
            <p className="mb-8 text-center text-slate-600">
              Manage your projects efficiently
            </p>

            <div className="flex flex-col gap-4">
              <Link to="/login">
                <button className="w-full rounded-lg bg-teal-500 px-4 py-3 text-xl font-semibold text-white shadow-md transition-colors hover:bg-teal-600 hover:shadow-lg">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="w-full rounded-lg border-2 border-teal-500 px-4 py-3 text-xl font-semibold text-teal-500 transition-colors hover:bg-teal-50">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col overflow-auto md:h-[calc(100vh-5rem)] md:flex-row md:overflow-hidden">
            <main className="flex flex-1 flex-col gap-4 p-4">
              {totalTasks === 0 ? (
                <div className="mt-6 flex flex-col gap-4 rounded-lg border-0 bg-white p-4 text-center text-gray-500 shadow-md md:border-2 md:border-slate-300 md:bg-slate-100 md:shadow-none">
                  <p className="text-xl">No tasks yet!</p>
                  <p className="mt-2 text-sm">
                    Create a project and add your first task
                  </p>
                </div>
              ) : (
                <div className="flex justify-evenly gap-4">
                  <div className="flex h-24 w-1/3 flex-col items-center justify-center rounded-lg border-0 bg-white shadow-md md:border-2 md:border-slate-300 md:bg-slate-100 md:shadow-none">
                    <h3 className="text-sm font-semibold md:text-base">
                      Total Tasks
                    </h3>
                    <h4 className="text-lg font-bold md:text-xl">
                      {completedTasks} / {totalTasks}
                    </h4>
                  </div>
                  <div className="flex h-24 w-1/3 flex-col items-center justify-center rounded-lg border-0 bg-white shadow-md md:border-2 md:border-slate-300 md:bg-slate-100 md:shadow-none">
                    <h3 className="text-sm font-semibold md:text-base">
                      Progress
                    </h3>
                    <h4 className="text-lg font-bold md:text-xl">
                      {totalTasks > 0
                        ? Math.round((completedTasks / totalTasks) * 100)
                        : 0}
                      %
                    </h4>
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col rounded-lg border-0 bg-white p-4 shadow-lg md:border-2 md:border-slate-300 md:bg-slate-50 md:shadow-none">
                <h2 className="mb-4 text-center text-2xl font-bold">
                  Recent Projects
                </h2>
                <div className="flex flex-1 flex-col justify-center gap-4 md:gap-8">
                  {recentProjects.length > 0 ? (
                    recentProjects.map((project: Project) => (
                      <Link
                        to={`/project/${project._id}`}
                        key={project._id}
                        aria-label={`Open project ${project.title} - ${
                          project.tasks?.length || 0
                        } tasks`}
                      >
                        <div className="flex gap-4 rounded-lg border-0 bg-white p-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:bg-slate-200 hover:shadow-lg md:h-28 md:border-2 md:border-slate-300 md:bg-slate-100 md:shadow-none">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold">
                              {project.title}
                            </h4>
                            <p className="text-slate-600">
                              {project.tasks?.length || 0} Tasks
                            </p>
                          </div>
                          <div className="flex w-32 flex-col justify-center">
                            <div
                              className="h-4 w-full rounded-xl bg-gray-300"
                              role="progressbar"
                              aria-valuenow={
                                project.tasks?.length
                                  ? Math.round(
                                      (project.tasks.filter(
                                        (t: Task) => t.complete
                                      ).length /
                                        project.tasks.length) *
                                        100
                                    )
                                  : 0
                              }
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label="Project completion progress"
                            >
                              <div
                                className="h-4 rounded-xl bg-teal-500 transition-all duration-300"
                                style={{
                                  width: `${
                                    project.tasks?.length
                                      ? (project.tasks.filter(
                                          (t: Task) => t.complete
                                        ).length /
                                          project.tasks.length) *
                                        100
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <p className="mt-1 text-center text-sm text-slate-600">
                              {project.tasks?.length
                                ? Math.round(
                                    (project.tasks.filter(
                                      (t: Task) => t.complete
                                    ).length /
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
                      <p className="mt-2 text-sm">
                        Start by creating a new project!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </main>

            <aside className="flex flex-col border-t-2 border-l-0 border-t-slate-300 bg-slate-100 p-4 md:w-1/3 md:border-t-0 md:border-l-2 md:border-slate-300">
              <h2 className="border-b-2 border-b-slate-300 pb-2 text-center text-2xl font-bold">
                All Projects
              </h2>
              <div className="my-4 flex flex-col gap-2">
                {userProjects.map((project: Project) => (
                  <Link
                    to={`/project/${project._id}`}
                    key={project._id}
                    aria-label={`Open project: ${project.title}`}
                  >
                    <div className="flex items-center justify-between rounded-md border-0 bg-white px-3 py-2 shadow-sm transition-all duration-200 hover:border-teal-400 hover:bg-slate-200 md:border-2 md:border-slate-300 md:bg-transparent md:shadow-none">
                      <span className="font-medium">{project.title}</span>
                      <span className="text-sm text-slate-500">
                        {project.tasks?.length || 0} tasks
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/project" className="mt-auto hidden md:block">
                <button className="w-full rounded-md border-2 border-teal-500 bg-teal-500 py-2.5 font-semibold text-white transition-colors hover:bg-teal-600">
                  Add Project
                </button>
              </Link>
            </aside>
          </div>
          <Link to="/project" className="fixed right-6 bottom-6 z-50 md:hidden">
            <button
              className="flex h-14 w-14 items-center justify-center rounded-4xl bg-teal-500 text-white shadow-lg transition-colors hover:bg-teal-600"
              aria-label="Add new project"
            >
              <FontAwesomeIcon icon={faPlus} className="text-4xl" />
            </button>
          </Link>
        </>
      )}
    </>
  );
};

export default Home;
