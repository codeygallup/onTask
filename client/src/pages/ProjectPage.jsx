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
    [setSelectedOption]
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
        <div className="border-2 border-slate-300 rounded-lg p-4 m-10 bg-slate-50 h-[calc(100vh-10rem)] flex flex-col">
          <div className="flex flex-col gap-4 flex-1 overflow-hidden">
            <CardHeader project={project} removeProject={handleDeleteProject} />

            <div className="flex justify-between items-center mb-2">
              <label htmlFor="task-filter" className="sr-only">
                Filter tasks
              </label>
              <select
                id="task-filter"
                value={selectedOption}
                onChange={handleSelect}
                className="bg-slate-50 border-2 border-slate-300 rounded-md py-1 px-2"
              >
                <option value="allTasks">All Tasks</option>
                <option value="completedTasks">Completed Tasks</option>
                <option value="incompletedTasks">Incomplete Tasks</option>
              </select>

              {selectedOption !== "incompletedTasks" && (
                <button
                  disabled={selectedTasks.length === 0}
                  className={`transition-colors px-2 py-1 rounded-md border-2 ${
                    selectedTasks.length > 0
                      ? "text-red-500 border-red-300 hover:bg-red-50 hover:border-red-400"
                      : "text-slate-400 border-slate-200 cursor-not-allowed"
                  }`}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto mb-4">
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
                  "px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600",
                onClick: () => setDeleteModal(false),
              },
              {
                label: "Delete",
                className:
                  "px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600",
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
