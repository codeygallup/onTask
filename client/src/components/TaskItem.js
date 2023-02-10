import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { TaskContext } from "./TaskContext";

export default function TaskItem({ task }) {
  const { removeTask, refetch } = useContext(TaskContext);
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

  return (
    <>
      <div className="task-section">
        <p className="task">{task.taskText}</p>
        <button
          className="btn btn-danger"
          onClick={(e) => {
            taskDelete(e, task._id);
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </>
  );
}
