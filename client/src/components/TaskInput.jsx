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
        <div className="flex justify-center items-center md:mt-10 md:mb-4">
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
            className="border-2 border-slate-300 rounded-md w-2/3 py-1 px-2 md:p-2 bg-slate-100 mr-2.5 focus:outline-teal-400"
            spellCheck="true"
          />
          <button
            className="border-2 border-teal-500 rounded-md py-1 px-2 md:py-2 md:px-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold transition-colors"
            type="submit"
          >
            Add Task
          </button>
        </div>
      </form>
    </>
  );
}
