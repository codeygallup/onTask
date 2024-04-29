import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { TaskContext } from "./TaskContext";

export default function TaskItem({ task }) {

  let { removeTask, updateComplete, refetch } = useContext(TaskContext);
  const taskDelete = async (e, taskId) => {
    e.preventDefault();

    try {
      await removeTask({
        variables: { taskId },
      });
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const changeStatus = async (e, taskId) => {
    e.preventDefault();

    try {
      await updateComplete({
        variables: { taskId },
      });
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center my-2">
        <p
          className={`${
            task.complete ? "task-complete" : ""
          }`}
        >
          {task.taskText}
        </p>
        <button
          className="btn btn-danger"
          onClick={(e) => {
            taskDelete(e, task._id);
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <button
          className="btn btn-danger"
          onClick={(e) => {
            changeStatus(e, task._id);
          }}
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </div>
    </>
  );
}
