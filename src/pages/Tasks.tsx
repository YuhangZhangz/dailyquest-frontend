import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axios";
import TopBar from "../components/AuthTopBar";
import "../styles/Tasks.css";
import TaskColumn from "../components/TaskColumn";
import AddTaskModal from "../components/AddTaskModal";
import PlayerStatusPanel from "../components/PlayerStatusPanel";
import type { DailyTask, TaskType, UserProfile } from "../types/task";

function getErrorDetails(err: unknown) {
  if (axios.isAxiosError(err)) {
    return err.response?.data || err.message;
  }

  return err;
}

function Tasks() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [hideCompleted, setHideCompleted] = useState(() => {
    return localStorage.getItem("hideCompleted") === "true";
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [creatingType, setCreatingType] = useState<TaskType>("DAILY");
  const [xpPopup, setXpPopup] = useState<{
    xp: number;
    x: number;
    y: number;
  } | null>(null);

  const loadData = useCallback(async () => {
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
    } catch (err: unknown) {
      console.log("Load data error:", getErrorDetails(err));

      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [loadData]);

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
    } catch (err: unknown) {
      console.log("Create task error:", getErrorDetails(err));
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
    } catch (err: unknown) {
      console.log("Complete task error:", getErrorDetails(err));
    }
  }

  async function handleDeleteTask(id: number) {
    try {
      await api.delete(`/daily-tasks/${id}`);
      await loadData();
    } catch (err: unknown) {
      console.log("Delete task error:", getErrorDetails(err));
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
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err: unknown) {
      console.log("Update task error:", getErrorDetails(err));
    }
  }

  async function handleRevertTask(id: number) {
    try {
      await api.patch(`/daily-tasks/${id}/revert`);
      await loadData();
    } catch (err: unknown) {
      console.log("Revert task error:", getErrorDetails(err));
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
      await api.patch(`/daily-tasks/${taskType}/sort-order`, orderedIds);

      await loadData();
    } catch (err: unknown) {
      console.log("Save sort order error:", getErrorDetails(err));
      setTasks(previousTasks);
    }
  }

  // Create a new subtask under a parent task
  async function handleAddSubTask(taskId: number, title: string) {
    try {
      await api.post(`/subtasks/task/${taskId}`, {
        title,
      });

      await loadData();
    } catch (err: unknown) {
      console.log("Add subtask error:", getErrorDetails(err));
    }
  }

  // Toggle subtask completion status
  async function handleToggleSubTask(_taskId: number, subTaskId: number) {
    try {
      await api.patch(`/subtasks/${subTaskId}/toggle`);

      await loadData();
    } catch (err: unknown) {
      console.log("Toggle subtask error:", getErrorDetails(err));
    }
  }

  // Delete a subtask
  async function handleDeleteSubTask(_taskId: number, subTaskId: number) {
    try {
      await api.delete(`/subtasks/${subTaskId}`);

      await loadData();
    } catch (err: unknown) {
      console.log("Delete subtask error:", getErrorDetails(err));
    }
  }

  const currentXp = user?.totalXp ?? 0;
  const level = user?.level ?? 1;
  const streak = user?.dailyStreak ?? 0;

  const visibleTasks = hideCompleted
    ? tasks.filter((task) => !isTaskCompleted(task))
    : tasks;

  const habitTasks = visibleTasks
    .filter((task) => task.taskType === "HABIT")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Keep user's custom order
  const dailyTasks = visibleTasks
    .filter((task) => task.taskType === "DAILY")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Keep user's custom order
  const todoTasks = visibleTasks
    .filter((task) => task.taskType === "TODO")
    .sort((a, b) => a.sortOrder - b.sortOrder);

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
        <PlayerStatusPanel
          level={level}
          totalXp={currentXp}
          dailyStreak={streak}
          coinBalance={user?.coinBalance ?? 0}
        />

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
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setHideCompleted(checked);
                    localStorage.setItem("hideCompleted", String(checked));
                  }}
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
              onAddSubTask={handleAddSubTask}
              onToggleSubTask={handleToggleSubTask}
              onDeleteSubTask={handleDeleteSubTask}
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
              onAddSubTask={handleAddSubTask}
              onToggleSubTask={handleToggleSubTask}
              onDeleteSubTask={handleDeleteSubTask}
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