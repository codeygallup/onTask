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
        <div className="text-center input-group my-4">
          <input
            placeholder="Enter task..."
            name="text"
            ref={taskRef}
            onChange={handleFormChange}
            value={task.text}
            type="text"
            className="form-control"
            spellCheck="true"
            style={{ marginRight: "20px" }}
          />
          <button className="btn btn-info" type="submit">
            Add Task
          </button>
        </div>
      </form>
    </>
  );
}
