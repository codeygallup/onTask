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
        : [...prev, task._id],
    );
  };

  const isSelected = selectedTasks.includes(task._id);

  return (
    <>
      <div className="relative mb-2 flex items-center justify-between gap-2 rounded-lg border-b-0 bg-slate-50 p-4 shadow-sm transition-colors hover:bg-slate-100 md:mb-0 md:rounded-none md:border-b-2 md:border-slate-300 md:bg-transparent md:shadow-none">
        <button
          onClick={handleTaskSelect}
          aria-label={isSelected ? "Deselect task" : "Select task for deletion"}
          className={`absolute top-1.5 right-1 md:-right-1 z-10 flex h-4 w-4 items-center justify-center rounded-xl border-2 transition-all duration-200 ${
            isSelected
              ? "border-red-500 bg-red-500"
              : "border-slate-300 bg-transparent hover:border-slate-400"
          }`}
        ></button>

        <p
          className={`flex-1 pr-8 wrap-break-word transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-96" : "line-clamp-2 max-h-12"
          } ${
            task.complete ? "task-complete" : ""
          } cursor-pointer overflow-hidden`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {task.text}
        </p>

        <div className="mr-2 shrink-0">
          <ButtonGroup task={task} />
        </div>
      </div>
    </>
  );
}
