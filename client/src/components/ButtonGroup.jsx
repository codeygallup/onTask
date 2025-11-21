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
          className="border-2 border-slate-300 rounded-md py-0.5 px-1.5 md:py-1 md:px-2 bg-violet-500"
          onClick={(e) => {
            changeStatus(e, task._id);
          }}
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
      ) : (
        <div className="flex md:gap-2 flex-col md:flex-row">
          <button
            className="border-2 border-slate-300 rounded-md py-0.5 px-1 md:py-1 md:px-2 bg-green-300"
            onClick={(e) => {
              changeStatus(e, task._id);
            }}
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} />
          </button>
          {/* <button
            className={`border-2 border-slate-300 rounded-md py-0.5 px-1 md:py-1 md:px-2 ${isSelected ? "bg-red-800" : "bg-amber-400"}`}
            onClick={() => {
              handleTaskSelect(task._id);
            }}
          >
            <FontAwesomeIcon icon={faCheckDouble} />
          </button> */}
        </div>
      )}
    </>
  );
}
