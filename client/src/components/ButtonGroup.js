import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faCheck,
  faCheckDouble,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { TaskContext } from "./TaskContext";

export default function ButtonGroup({ task }) {
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
            className="btn btn-danger"
            onClick={(e) => {
              taskDelete(e, task._id);
            }}
          >
            {/* <FontAwesomeIcon icon={faCheckDouble} /> */}
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <button
            className="btn btn-success"
            onClick={(e) => {
              changeStatus(e, task._id);
            }}
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} />
          </button>
        </div>
      )}
    </>
  );
}
