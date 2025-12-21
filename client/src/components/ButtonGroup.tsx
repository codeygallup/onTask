import { useContext } from "react";
import type { ButtonGroupProps } from "../types";
import { TaskContext } from "./TaskContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft, faCheck } from "@fortawesome/free-solid-svg-icons";

const ButtonGroup = ({ task }: ButtonGroupProps) => {
  const taskContext = useContext(TaskContext);
  if (!taskContext)
    throw new Error("ButtonGroup must be used within TaskContext.Provider");
  const { updateComplete, refetch } = taskContext;

  const changeStatus = async (
    e: React.MouseEvent<HTMLButtonElement>,
    taskId: string
  ): Promise<void> => {
    e.preventDefault();
    try {
      await updateComplete({ variables: { taskId } });
      await refetch();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <>
      {!task.complete ? (
        <button
          className="rounded-md border-2 border-slate-300 bg-teal-500 px-1.5 py-1 transition-colors hover:bg-teal-600 md:px-2 md:py-1"
          onClick={(e) => changeStatus(e, task._id)}
          title="Mark as complete"
          aria-label="Mark task as complete"
        >
          <FontAwesomeIcon icon={faCheck} className="text-white" />
        </button>
      ) : (
        <button
          className="rounded-md border-2 border-slate-300 bg-slate-400 p-1.5 transition-colors hover:bg-slate-500 md:px-2 md:py-1"
          onClick={(e) => changeStatus(e, task._id)}
          title="Mark as incomplete"
          aria-label="Mark task as incomplete"
        >
          <FontAwesomeIcon icon={faArrowRotateLeft} className="text-white" />
        </button>
      )}
    </>
  );
};

export default ButtonGroup;
