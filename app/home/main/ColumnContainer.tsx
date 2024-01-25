import { Column } from "@/firebase/models/Column";
import { useTasks } from "../hooks/useTasks";
import TaskItem from "./TaskItem";

/* TODO: improve keyboard support */

export default function ColumnContainer({
  column,
  index,
}: {
  column: Column;
  index: number;
}) {
  const { tasks, loading } = useTasks(column);

  const color = (() => {
    if ((index + 1) % 3 === 0) {
      return "bg-green";
    } else if (index % 2 === 0) {
      return "bg-cyan";
    } else {
      return "bg-primary";
    }
  })();

  return (
    <div className="h-fit min-w-[280px]">
      {/* Header */}
      <div className="flex items-center gap-x-3">
        <div className={`h-[15px] w-[15px] rounded-full ${color}`}></div>
        <p className="text-xs font-bold uppercase tracking-[2.4px] text-medium-grey">
          {column.name} ({tasks.length})
        </p>
      </div>
      {/* Tasks */}
      <ul className="mt-6 flex flex-col gap-y-5">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} column={column} />
        ))}
      </ul>
    </div>
  );
}
