import ButtonGroup from "./ButtonGroup";

export default function TaskItem({ task }) {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center my-2">
        <p className={`${task.complete ? "task-complete text-black-50" : ""}`}>
          {task.text}
        </p>
        <div className="mx-3">
          <ButtonGroup task={task} />
        </div>
      </div>
    </>
  );
}
