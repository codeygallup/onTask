import ButtonGroup from "./ButtonGroup";

export default function TaskItem({ task }) {
  return (
    <>
      <div className="flex justify-between items-center border-b-2 border-slate-300 p-2">
        <p className={`${task.complete ? "task-complete" : ""}`}>{task.text}</p>
        <div className="flex gap-2">
          <ButtonGroup task={task} />
        </div>
      </div>
    </>
  );
}
