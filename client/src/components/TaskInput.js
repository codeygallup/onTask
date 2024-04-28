import { useContext } from "react";
import { TaskContext } from "./TaskContext";

export default function TaskInput() {
  let { task, addTask, setTask, refetch, id } = useContext(TaskContext);
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleTask = async (e) => {
    e.preventDefault();

    try {
      await addTask({
        variables: { ...task },
      });
      refetch();
    } catch (err) {
      console.error(err);
    }

    setTask({
      taskText: "",
      complete: false,
      taskProject: id,
    });
  };

  return (
    <>
      <div className="text-center input-group my-4">
        <input
          placeholder="Enter task..."
          name="taskText"
          onChange={handleFormChange}
          value={task.taskText}
          type="text"
          className="form-control"
          style={{ marginRight: "20px" }}
        />
        <button className="btn btn-info" onClick={handleTask}>
          Add Task
        </button>
      </div>
    </>
  );
}
