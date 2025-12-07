import { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { UPDATE_LAST_OPENED } from "../utils/mutations";
import { CardHeader, TaskInput, TaskItem } from "../components";
import { TaskContext } from "../components/TaskContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/Modal";
import { useTask } from "../hooks/useTask";
import { useProject } from "../hooks/useProject";

function ProjectPage() {
  let { id } = useParams();

  const [updateLastOpened] = useMutation(UPDATE_LAST_OPENED);

  useEffect(() => {
    if (id) {
      updateLastOpened({
        variables: { projectId: id },
      }).catch((err) => console.error("Failed to update lastOpenedAt:", err));
    }
  }, [id, updateLastOpened]);

  const {
    selectedTasks,
    selectedOption,
    setSelectedOption,
    setSelectedTasks,
    handleDeleteSelectedTasks,
    project,
    filteredTasks,
    handleAddTask,
    updateComplete,
    refetch,
  } = useTask(id);

  const { handleDeleteProject } = useProject(id);

  const [deleteModal, setDeleteModal] = useState(false);
  const [task, setTask] = useState({
    text: "",
    complete: false,
    projectId: id,
  });

  const handleSelect = useCallback(
    (e) => {
      setSelectedOption(e.target.value);
    },
    [setSelectedOption],
  );

  return (
    <>
      <TaskContext.Provider
        value={{
          task,
          setTask,
          selectedTasks,
          setSelectedTasks,
          handleAddTask,
          updateComplete,
          refetch,
          setSelectedOption,
          selectedOption,
          projectId: id,
        }}
      >
        <div className="m-2 flex h-[calc(100vh-8rem)] flex-col rounded-lg border-0 bg-white p-2 shadow-lg md:m-10 md:h-[calc(100vh-10rem)] md:border-2 md:border-slate-300 md:bg-slate-50 md:p-4 md:shadow-none">
          <div className="flex flex-1 flex-col gap-4 overflow-hidden">
            <CardHeader project={project} removeProject={handleDeleteProject} />

            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="task-filter" className="sr-only">
                Filter tasks
              </label>
              <select
                id="task-filter"
                value={selectedOption}
                onChange={handleSelect}
                className="rounded-md border-2 border-slate-300 bg-white px-2 py-1 shadow-sm focus:border-teal-500 focus:outline-none md:bg-slate-50 md:shadow-none"
              >
                <option value="allTasks">All Tasks</option>
                <option value="completedTasks">Completed Tasks</option>
                <option value="incompletedTasks">Incomplete Tasks</option>
              </select>

              {selectedOption !== "incompletedTasks" && (
                <button
                  disabled={selectedTasks.length === 0}
                  onClick={() => setDeleteModal(true)}
                  aria-label={
                    selectedTasks.length > 0
                      ? "Delete selected tasks"
                      : "No tasks selected"
                  }
                  className={`rounded-md border-2 px-2 py-1 transition-colors ${
                    selectedTasks.length > 0
                      ? "border-red-300 text-red-500 hover:border-red-400 hover:bg-red-50 animate-bounce"
                      : "cursor-not-allowed border-slate-200 text-slate-400"
                  }`}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="custom-scrollbar mb-4 flex-1 overflow-y-auto pe-6">
                {filteredTasks.map((task) => (
                  <TaskItem key={task._id} task={task} />
                ))}
              </div>
              <TaskInput selectedOption={selectedOption} />
            </div>
          </div>
        </div>
        {deleteModal && (
          <Modal
            modalMessage={
              selectedTasks.length === 1
                ? "Are you sure you want to delete this task?"
                : `Are you sure you want to delete ${selectedTasks.length} tasks?`
            }
            buttonConfig={[
              {
                label: "Cancel",
                className:
                  "px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 font-semibold",
                onClick: () => setDeleteModal(false),
              },
              {
                label: "Delete",
                className:
                  "px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold",
                onClick: () => {
                  handleDeleteSelectedTasks();
                  setDeleteModal(false);
                },
              },
            ]}
          />
        )}
      </TaskContext.Provider>
    </>
  );
}

export default ProjectPage;
