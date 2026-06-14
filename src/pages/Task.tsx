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
  sortOrder: number;
};

function Tasks() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [hideCompleted, setHideCompleted] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [creatingType, setCreatingType] = useState<TaskType>("DAILY");
  const [xpPopup, setXpPopup] = useState<{
    xp: number;
    x: number;
    y: number;
  } | null>(null);

  async function loadData() {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const userRes = await api.get("/auth/me");
      const taskRes = await api.get("/daily-tasks");

      setUser(userRes.data);
      setTasks(taskRes.data);
    } catch (err: any) {
      console.log("Load data error:", err.response?.data || err);

      localStorage.removeItem("token");
      window.location.href = "/";
    }
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

  async function handleCompleteTask(
    id: number,
    baseXp?: number,
    x?: number,
    y?: number
  ) {
    if (baseXp !== undefined && x !== undefined && y !== undefined) {
      setXpPopup({ xp: baseXp, x, y });

      setTimeout(() => {
        setXpPopup(null);
      }, 800);
    }

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
      const response = await api.put(`/daily-tasks/${id}`, {
        title,
        description,
        difficulty,
        taskType,
        dueDate,
      });

      const updatedTask = response.data;

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? updatedTask : task
        )
      );
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

  async function handleReorderTasks(taskType: TaskType, orderedIds: number[]) {
    const previousTasks = tasks;

    const nextTasks = tasks.map((task) => {
      if (task.taskType !== taskType) {
        return task;
      }

      const newIndex = orderedIds.indexOf(task.id);

      if (newIndex === -1) {
        return task;
      }

      return {
        ...task,
        sortOrder: newIndex,
      };
    });

    setTasks(nextTasks);

    try {
      await api.patch(
        `/daily-tasks/${taskType}/sort-order`,
        orderedIds
      );

      await loadData();
    } catch (err: any) {
      console.log("Save sort order error:", err.response?.data || err);
      setTasks(previousTasks);
    }
  }

  const currentXp = user?.totalXp ?? 0;
  const level = user?.level ?? 1;
  const streak = user?.dailyStreak ?? 0;
  const needNext = level * 100;
  const xpPercent = Math.min((currentXp / needNext) * 100, 100);

  const visibleTasks = hideCompleted
    ? tasks.filter((task) => !isTaskCompleted(task))
    : tasks;

  const habitTasks = visibleTasks
    .filter((task) => task.taskType === "HABIT")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  
    // For dailies, sort active ones first, then by sortOrder
  const dailyTasks = visibleTasks
    .filter((task) => task.taskType === "DAILY")
    .sort((a, b) => {
      const aCompleted = isTaskCompleted(a);
      const bCompleted = isTaskCompleted(b);

      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1;
      }

      return a.sortOrder - b.sortOrder;
    });
  
  // For todos, sort active ones first, then by sortOrder
  const todoTasks = visibleTasks
    .filter((task) => task.taskType === "TODO")
    .sort((a, b) => {
      if (a.active !== b.active) {
        return a.active ? -1 : 1;
      }

      return a.sortOrder - b.sortOrder;
    });

  return (
    <div className="tasks-page">

      {xpPopup && (
        <span
          className="global-xp-float"
          style={{
            left: xpPopup.x,
            top: xpPopup.y - 40,
          }}
        >
          +{xpPopup.xp} XP
        </span>
      )}

      <TopBar showLogout username={user?.username} />

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
              taskType="HABIT"
              tasks={habitTasks}
              onAdd={() => openAddForm("HABIT")}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
              onRevert={handleRevertTask}
              onReorder={handleReorderTasks}
            />

            <TaskColumn
              title="⚔️ Dailies"
              addLabel="Add Daily"
              taskType="DAILY"
              tasks={dailyTasks}
              onAdd={() => openAddForm("DAILY")}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
              onRevert={handleRevertTask}
              onReorder={handleReorderTasks}
            />

            <TaskColumn
              title="🎯 Todos"
              addLabel="Add Todo"
              taskType="TODO"
              tasks={todoTasks}
              onAdd={() => openAddForm("TODO")}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
              onRevert={handleRevertTask}
              onReorder={handleReorderTasks}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function isTaskCompleted(task: DailyTask) {
  const today = new Date().toLocaleDateString("en-CA");

  if (task.taskType === "DAILY") {
    return task.lastCompletedDate === today;
  }

  if (task.taskType === "TODO") {
    return !task.active;
  }

  return false;
}

export default Tasks;