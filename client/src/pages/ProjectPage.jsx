import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { CardHeader, TaskInput, TaskItem, HomeButton } from "../components";
import { TaskContext } from "../components/TaskContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/Modal";
import { useTask } from "../hooks/useTask";
import { useProject } from "../hooks/useProject";

function ProjectPage() {
  let { id } = useParams();

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
          projectId: id,
        }}
      >
        <HomeButton />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="shadow rounded">
            <CardHeader project={project} removeProject={handleDeleteProject} />
            <div className="text-center d-flex justify-content-center fs-5 position-relative mb-3">
              <select value={selectedOption} onChange={handleSelect}>
                <option value="allTasks">All Tasks</option>
                <option value="completedTasks">Completed Tasks</option>
                <option value="incompletedTasks">Incomplete Tasks</option>
              </select>
              {/* Show no trash when the task list is empty? */}
              {selectedOption !== "incompletedTasks" && (
                <button
                  className="btn btn-danger position-absolute top-50 end-0 translate-middle-y me-2"
                  disabled={selectedTasks.length === 0}
                  onClick={() => setDeleteModal(true)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
            <div className="container vw-100">
              <div className="side">
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
                : `Are you sure you want to delete all ${selectedTasks.length} tasks?`
            }
            buttonConfig={[
              {
                label: "Cancel",
                className: "btn-success",
                onClick: () => setDeleteModal(false),
              },
              {
                label: "Confirm",
                className: "btn-danger",
                onClick: handleDeleteSelectedTasks,
              },
            ]}
          />
        )}
      </TaskContext.Provider>
    </>
  );
}

export default ProjectPage;
