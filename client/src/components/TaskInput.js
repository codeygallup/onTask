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
      <div className="text-center">
        <input
          placeholder="Enter task..."
          name="taskText"
          onChange={handleFormChange}
          value={task.taskText}
          type="text"
          className="mx-4 my-4 btn"
          style={{ marginRight: "10px" }}
        ></input>
        <button className="btn btn-info mx-4" onClick={handleTask}>
          Add Task
        </button>
      </div>
    </>
  );
}
