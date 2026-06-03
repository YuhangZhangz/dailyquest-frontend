import TaskCard from "./TaskCard";

type TaskType = "HABIT" | "DAILY" | "TODO";

type DailyTask = {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  taskType: TaskType;
  baseXp: number;
  active: boolean;
  createdAt: string;
};

type TaskColumnProps = {
  title: string;
  tasks: DailyTask[];
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
};

function TaskColumn({ title, tasks, onComplete, onDelete }: TaskColumnProps) {
  return (
    <section className="quest-column">
      <h2>{title}</h2>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}

export default TaskColumn;