import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { ONE_PROJECT } from "../utils/queries";
import {
  REMOVE_PROJECT,
  ADD_TASK,
  REMOVE_TASKS,
  UPDATE_COMPLETE,
} from "../utils/mutations";
import { CardHeader, TaskInput, TaskItem, HomeButton } from "../components";
import { TaskContext } from "../components/TaskContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/Modal";

function ProjectPage() {
  let { id } = useParams();

  const [task, setTask] = useState({
    taskText: "",
    complete: false,
    taskProject: id,
  });
  const [selectedOption, setSelectedOption] = useState("allTasks");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const [addTask] = useMutation(ADD_TASK);
  const [removeTasks] = useMutation(REMOVE_TASKS);
  const [removeProject] = useMutation(REMOVE_PROJECT);
  const [updateComplete] = useMutation(UPDATE_COMPLETE);

  const { data: { oneProject = {} } = {}, refetch } = useQuery(ONE_PROJECT, {
    variables: { id: id },
  });

  const allTasks = useMemo(() => oneProject.tasks || [], [oneProject]);
  const completedTasks = useMemo(
    () => oneProject.tasks?.filter((task) => task.complete) || [],
    [oneProject]
  );
  const incompletedTasks = useMemo(
    () => oneProject.tasks?.filter((task) => !task.complete) || [],
    [oneProject]
  );

  const tasks = useMemo(() => {
    switch (selectedOption) {
      case "allTasks":
        return allTasks;
      case "completedTasks":
        return completedTasks;
      case "incompletedTasks":
        return incompletedTasks;
      default:
        return allTasks;
    }
  }, [selectedOption, allTasks, completedTasks, incompletedTasks]);

  const handleSelect = useCallback((e) => {
    setSelectedOption(e.target.value);
  }, []);

  const handleDeleteSelectedTasks = async () => {
    try {
      await removeTasks({
        variables: { taskIds: selectedTasks },
      });
      await refetch();
      setSelectedOption(selectedOption);
      setSelectedTasks([]);
      setDeleteModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <TaskContext.Provider
        value={{
          task,
          setTask,
          removeTasks,
          addTask,
          updateComplete,
          refetch,
          setSelectedOption,
          selectedOption,
          setSelectedTasks,
          selectedTasks,
          handleSelect,
          id,
        }}
      >
        <HomeButton />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="shadow rounded">
            <CardHeader project={oneProject} removeProject={removeProject} />
            <div className="text-center d-flex justify-content-center fs-5 position-relative mb-3">
              <select value={selectedOption} onChange={handleSelect}>
                <option value="allTasks">All Tasks</option>
                <option value="completedTasks">Completed Tasks</option>
                <option value="incompletedTasks">Incomplete Tasks</option>
              </select>
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
                {tasks.map((task) => (
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
