import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { TaskContext } from "./TaskContext";

export default function ButtonGroup({ task }) {
  let { updateComplete, refetch } = useContext(TaskContext);

  const changeStatus = async (e, taskId) => {
    e.preventDefault();
    try {
      await updateComplete({ variables: { taskId } });
      await refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {!task.complete ? (
        <button
          className="border-2 border-slate-300 rounded-md py-1 px-1.5 md:py-1 md:px-2 bg-teal-500 hover:bg-teal-600 transition-colors"
          onClick={(e) => changeStatus(e, task._id)}
          title="Mark as complete"
        >
          <FontAwesomeIcon icon={faCheck} className="text-white" />
        </button>
      ) : (
        <button
          className="border-2 border-slate-300 rounded-md p-1.5 md:py-1 md:px-2 bg-slate-400 hover:bg-slate-500 transition-colors"
          onClick={(e) => changeStatus(e, task._id)}
          title="Mark as incomplete"
        >
          <FontAwesomeIcon icon={faArrowRotateLeft} className="text-white" />
        </button>
      )}
    </>
  );
}
