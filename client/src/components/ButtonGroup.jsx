import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faCheck,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { TaskContext } from "./TaskContext";

export default function ButtonGroup({ task }) {
  let { updateComplete, refetch, setSelectedTasks, selectedTasks } =
    useContext(TaskContext);

  const changeStatus = async (e, taskId) => {
    e.preventDefault();

    try {
      await updateComplete({
        variables: { taskId },
      });
      await refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const isSelected = selectedTasks.includes(task._id);

  return (
    <>
      {!task.complete ? (
        <button
          className="btn btn-danger"
          onClick={(e) => {
            changeStatus(e, task._id);
          }}
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
      ) : (
        <div className="btn-group">
          <button
            className="btn btn-success"
            onClick={(e) => {
              changeStatus(e, task._id);
            }}
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} />
          </button>
          <button
            className={`btn ${isSelected ? "btn-warning" : "btn-danger"}`}
            onClick={() => {
              handleTaskSelect(task._id);
            }}
          >
            <FontAwesomeIcon icon={faCheckDouble} />
          </button>
        </div>
      )}
    </>
  );
}
