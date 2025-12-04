import { useState, useContext } from "react";
import { TaskContext } from "./TaskContext";
import ButtonGroup from "./ButtonGroup";

export default function TaskItem({ task }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setSelectedTasks, selectedTasks } = useContext(TaskContext);

  const handleTaskSelect = (e) => {
    e.stopPropagation();
    setSelectedTasks((prev) =>
      prev.includes(task._id)
        ? prev.filter((id) => id !== task._id)
        : [...prev, task._id]
    );
  };

  const isSelected = selectedTasks.includes(task._id);

  return (
    <>
      <div className="relative flex justify-between items-center border-b-0 md:border-b-2 md:border-slate-300 bg-slate-50 md:bg-transparent p-4 gap-2 mb-2 md:mb-0 rounded-lg md:rounded-none shadow-sm md:shadow-none hover:bg-slate-100 transition-colors">
        <button
          onClick={handleTaskSelect}
          aria-label={isSelected ? "Deselect task" : "Select task for deletion"}
          className={`absolute top-2 right-1 w-4 h-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center z-10 ${
            isSelected
              ? "border-red-500 bg-red-500"
              : "border-slate-300 bg-transparent hover:border-slate-400"
          }`}
        ></button>

        <p
          className={`flex-1 wrap-break-word transition-all duration-300 ease-in-out pr-8 ${
            isExpanded ? "max-h-96" : "line-clamp-2 max-h-12"
          } ${
            task.complete ? "task-complete" : ""
          } cursor-pointer overflow-hidden`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {task.text}
        </p>

        <div className="shrink-0 mr-2">
          <ButtonGroup task={task} />
        </div>
      </div>
    </>
  );
}
