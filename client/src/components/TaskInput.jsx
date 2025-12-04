import { useContext, useEffect, useRef } from "react";
import { TaskContext } from "./TaskContext";

export default function TaskInput() {
  const { task, setTask, handleAddTask, id } = useContext(TaskContext);

  const taskRef = useRef(null);
  useEffect(() => {
    taskRef.current.focus();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleTask = async (e) => {
    e.preventDefault();

    try {
      await handleAddTask({
        ...task,
      });

      setTask({
        text: "",
        complete: false,
        taskProject: id,
      });

      taskRef.current.focus();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form onSubmit={handleTask}>
        <div className="flex items-center justify-center md:mt-10 md:mb-4">
          <label htmlFor="task-input" className="sr-only">
            Task description
          </label>
          <input
            id="task-input"
            placeholder="Enter task..."
            name="text"
            ref={taskRef}
            onChange={handleFormChange}
            value={task.text}
            type="text"
            className="mr-2.5 w-2/3 rounded-md border-2 border-slate-300 bg-slate-100 px-2 py-1 focus:outline-teal-400 md:p-2"
            spellCheck="true"
          />
          <button
            className="rounded-md border-2 border-teal-500 bg-teal-500 px-2 py-1 font-semibold text-white transition-colors hover:bg-teal-600 md:px-4 md:py-2"
            type="submit"
          >
            Add Task
          </button>
        </div>
      </form>
    </>
  );
}
