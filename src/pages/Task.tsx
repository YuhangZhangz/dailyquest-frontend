import { useEffect, useState } from "react";
import api from "../api/axios";
import TopBar from "../components/AuthTopBar";
import "../styles/Tasks.css";
import TaskColumn from "../components/TaskColumn";
import AddTaskModal from "../components/AddTaskModal";

type UserProfile = {
  id: number;
  username: string;
  email: string;
  totalXp: number;
  level: number;
  dailyStreak: number;
};

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
  completedCount: number;
  lastCompletedDate: string | null;
  dueDate: string | null;
};

function Tasks() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [hideCompleted, setHideCompleted] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [creatingType, setCreatingType] = useState<TaskType>("DAILY");

  async function loadData() {
    const userRes = await api.get("/auth/me");
    const taskRes = await api.get("/daily-tasks");

    setUser(userRes.data);
    setTasks(taskRes.data);
  }

  useEffect(() => {
    loadData();
  }, []);

  function openAddForm(taskType: TaskType) {
    setCreatingType(taskType);
    setShowAddModal(true);
  }

  async function handleCreateTask(
    title: string,
    description: string,
    difficulty: string,
    dueDate: string | null
  ) {
    try {
      await api.post("/daily-tasks", {
        title,
        description,
        difficulty,
        taskType: creatingType,
        dueDate,
      });

      setShowAddModal(false);
      await loadData();
    } catch (err: any) {
      console.log("Create task error:", err.response?.data);
    }
  }

  async function handleCompleteTask(id: number) {
    try {
      await api.patch(`/daily-tasks/${id}/complete`);
      await loadData();
    } catch (err: any) {
      console.log("Complete task error:", err.response?.data);
    }
  }

  async function handleDeleteTask(id: number) {
    try {
      await api.delete(`/daily-tasks/${id}`);
      await loadData();
    } catch (err: any) {
      console.log("Delete task error:", err.response?.data);
    }
  }

  async function handleUpdateTask(
    id: number,
    title: string,
    description: string,
    difficulty: string,
    taskType: TaskType,
    dueDate: string | null
  ) {
    try {
      await api.put(`/daily-tasks/${id}`, {
        title,
        description,
        difficulty,
        taskType,
        dueDate,
      });

      await loadData();
    } catch (err: any) {
      console.log("Update task error:", err.response?.data);
    }
  }

  async function handleRevertTask(id: number) {
    try {
      await api.patch(`/daily-tasks/${id}/revert`);
      await loadData();
    } catch (err: any) {
      console.log("Revert task error:", err.response?.data);
    }
  }

  const currentXp = user?.totalXp ?? 0;
  const level = user?.level ?? 1;
  const streak = user?.dailyStreak ?? 0;
  const needNext = level * 100;
  const xpPercent = Math.min((currentXp / needNext) * 100, 100);

  const visibleTasks = hideCompleted
    ? tasks.filter((task) => task.active)
    : tasks;

  const habitTasks = visibleTasks.filter((task) => task.taskType === "HABIT");
  const dailyTasks = visibleTasks.filter((task) => task.taskType === "DAILY");
  const todoTasks = visibleTasks.filter((task) => task.taskType === "TODO");

  return (
    <div className="tasks-page">
      <TopBar showLogout />

      <main className="tasks-container">
        <section className="player-panel">
          <div className="player-summary-row">
            <div className="player-stat level-card">
              <span>PLAYER LEVEL</span>
              <h1>Lv. {level}</h1>
            </div>

            <div className="player-stat streak-stat">
              <div className="streak-inline">
                <span className="streak-icon">🔥</span>
                <span className="streak-label">Streak</span>
                <strong className="streak-number">{streak}</strong>
                <span className="streak-days">days</span>
              </div>
            </div>

            <div className="player-stat xp-stat">
              <span>CURRENT XP</span>
              <h2>
                {currentXp}/{needNext} XP
              </h2>
            </div>
          </div>

          <div className="xp-progress-section">
            <div className="xp-row">
              <span>Character Progress</span>
              <strong>{Math.round(xpPercent)}%</strong>
            </div>

            <div className="xp-bar">
              <div
                className="xp-fill"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </section>

        <section className="quest-board">
          <div className="quest-header">
            <div>
              <span className="section-kicker">QUEST BOARD</span>
              <h1>Today's Quests</h1>
            </div>

            <div className="quest-actions">
              <label className="hide-completed">
                <input
                  type="checkbox"
                  checked={hideCompleted}
                  onChange={(e) => setHideCompleted(e.target.checked)}
                />
                Hide Completed
              </label>
            </div>
          </div>

          {showAddModal && (
            <AddTaskModal
              taskType={creatingType}
              onClose={() => setShowAddModal(false)}
              onCreate={handleCreateTask}
            />
          )}

          <div className="quest-columns">
            <TaskColumn
              title="💪 Habits"
              addLabel="Add Habit"
              tasks={habitTasks}
              onAdd={() => openAddForm("HABIT")}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
              onRevert={handleRevertTask}
            />

            <TaskColumn
              title="⚔️ Dailies"
              addLabel="Add Daily"
              tasks={dailyTasks}
              onAdd={() => openAddForm("DAILY")}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
              onRevert={handleRevertTask}
            />

            <TaskColumn
              title="🎯 Todos"
              addLabel="Add Todo"
              tasks={todoTasks}
              onAdd={() => openAddForm("TODO")}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
              onRevert={handleRevertTask}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Tasks;