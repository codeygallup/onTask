export default function TaskItem({ task }) {
  
    const toggleComplete = (e, taskId) => {
        console.log(e)
    }
  

  return (
    <>
      <div className={task.complete ? "blue" : "green"}>
        <p className="task">{task.taskText}</p>
        <div>
          <button className="btn btn-link">Edit</button>
          <button className="btn btn-danger" onClick={(e) => {toggleComplete(e, task._id)}}>
            {!task.complete ? "Complete" : "Unfinished"}
          </button>
        </div>
      </div>
    </>
  );
}
