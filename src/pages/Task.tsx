import { useEffect, useState } from "react";
import api from "../api/axios";
import TopBar from "../components/AuthTopBar";
import "../styles/Tasks.css";
import TaskColumn from "../components/TaskColumn";

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
};

function Tasks() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [hideCompleted, setHideCompleted] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDifficulty, setNewDifficulty] = useState("T2");
  const [newTaskType, setNewTaskType] = useState<TaskType>("DAILY");

  async function loadData() {
    const userRes = await api.get("/auth/me");
    const taskRes = await api.get("/daily-tasks");

    setUser(userRes.data);
    setTasks(taskRes.data);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!newTitle.trim()) return;

    try {
      await api.post("/daily-tasks", {
        title: newTitle,
        description: newDescription,
        difficulty: newDifficulty,
        taskType: newTaskType,
      });

      setNewTitle("");
      setNewDescription("");
      setNewDifficulty("T2");
      setShowAddForm(false);
      setNewTaskType("DAILY");

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
    taskType: TaskType
  ) {
    try {
      await api.put(`/daily-tasks/${id}`, {
        title,
        description,
        difficulty,
        taskType,
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
          <div className="player-grid">
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

            <div className="player-stat">
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
              <button
                className="add-task-btn"
                type="button"
                onClick={() => setShowAddForm((prev) => !prev)}
              >
                + Add Quest
              </button>

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

          {showAddForm && (
            <form className="add-task-form" onSubmit={handleCreateTask}>
              <label>
                Task Name
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter task name"
                />
              </label>

              <label>
                Description
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Optional description"
                />
              </label>

              <label>
                Difficulty
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value)}
                >
                  <option value="T1">🟢 T1 - Easy</option>
                  <option value="T2">🟡 T2 - Normal</option>
                  <option value="T3">🔵 T3 - Hard</option>
                  <option value="T4">🔴 T4 - Elite</option>
                  <option value="BOSS">👑 Boss</option>
                </select>
              </label>

              <label>
                Task Type
                <select
                  value={newTaskType}
                  onChange={(e) => setNewTaskType(e.target.value as TaskType)}
                >
                  <option value="HABIT">🔁 Habit</option>
                  <option value="DAILY">📅 Daily</option>
                  <option value="TODO">✅ Todo</option>
                </select>
              </label>

              <div className="add-task-form-actions">
                <button type="submit">Save Quest</button>
                <button
                  type="button"
                  className="cancel-task-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="quest-columns">
            <TaskColumn
              title="💪 Habits"
              tasks={habitTasks}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
              onRevert={handleRevertTask}
            />

            <TaskColumn
              title="⚔️ Dailies"
              tasks={dailyTasks}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
              onRevert={handleRevertTask}
            />

            <TaskColumn
              title="🎯 Todos"
              tasks={todoTasks}
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