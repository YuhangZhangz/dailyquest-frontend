import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axios";
import TopBar from "../components/TopBar";
import "../styles/Tasks.css";
import TaskColumn from "../components/TaskColumn";
import AddTaskModal from "../components/AddTaskModal";
import PlayerStatusPanel from "../components/PlayerStatusPanel";
import type { DailyTask, TaskType, UserProfile } from "../types/task";
import Sidebar from "../components/Sidebar";

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
  const [rewardPopup, setRewardPopup] = useState<{
    xp: number;
    coins: number;
    x: number;
    y: number;
  } | null>(null);

  const [coinsPulse, setCoinsPulse] = useState(false);

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
    dueDate: string | null,
    subTaskTitles: string[]
  ) {
    if (!creatingType) return;

    const response = await api.post("/daily-tasks", {
      title,
      description,
      difficulty,
      taskType: creatingType,
      dueDate,
    });

    const createdTask = response.data;

    for (const subTaskTitle of subTaskTitles) {
      await api.post(`/subtasks/task/${createdTask.id}`, {
        title: subTaskTitle,
      });
    }

    await loadData();
  }

  async function handleCompleteTask(
    id: number,
    baseXp?: number,
    x?: number,
    y?: number
  ) {
    try {
      await api.patch(`/daily-tasks/${id}/complete`);
      await loadData();

      const rewardXp = baseXp ?? 0;

      // Temporarily use XP as the coin reward until the backend returns earnedCoins.
      const rewardCoins = baseXp ?? 0;

      if (rewardXp > 0 && x !== undefined && y !== undefined) {
        setRewardPopup({
          xp: rewardXp,
          coins: rewardCoins,
          x,
          y,
        });

        window.setTimeout(() => {
          setRewardPopup(null);
        }, 900);
      }

      if (rewardCoins > 0) {
        setCoinsPulse(true);

        window.setTimeout(() => {
          setCoinsPulse(false);
        }, 650);
      }
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

  async function handleReorderSubTasks(taskId: number, orderedIds: number[]) {
    const previousTasks = tasks;

    const nextTasks = tasks.map((task) => {
      if (task.id !== taskId) {
        return task;
      }

      const subTasks = [...(task.subTasks ?? [])];
      const orderedSubTasks = orderedIds
        .map((id) => subTasks.find((subTask) => subTask.id === id))
        .filter(
          (subTask): subTask is (typeof subTasks)[number] => Boolean(subTask)
        )
        .map((subTask, index) => ({ ...subTask, sortOrder: index }));

      const remainingSubTasks = subTasks.filter(
        (subTask) => !orderedIds.includes(subTask.id)
      );

      return {
        ...task,
        subTasks: [...orderedSubTasks, ...remainingSubTasks],
      };
    });

    setTasks(nextTasks);

    try {
      await api.patch(`/subtasks/task/${taskId}/sort-order`, orderedIds);
      await loadData();
    } catch (err: unknown) {
      console.log("Save subtask sort order error:", getErrorDetails(err));
      setTasks(previousTasks);
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
    <div className="app-shell">
      <Sidebar dailyStreak={streak} activePage="Quests" />

      <div className="tasks-page">
        {rewardPopup && (
          <div
            className="global-reward-popup"
            style={{
              left: rewardPopup.x,
              top: rewardPopup.y - 28,
            }}
          >
            <span className="global-xp-float">+{rewardPopup.xp} XP</span>
          </div>
        )}

        <TopBar showLogout username={user?.username} hideBrand />

        <main className="tasks-container">
          <PlayerStatusPanel
            level={level}
            totalXp={currentXp}
            dailyStreak={streak}
            coinBalance={user?.coinBalance ?? 0}
            coinsPulse={coinsPulse}
          />

          <section className="quest-board">
            <div className="quest-header">
              <div>
                <span className="section-kicker">QUEST BOARD</span>
                <h1>Today's Quests</h1>
              </div>

              <div className="quest-actions">
                <label className="hide-completed">
                  <span>Hide Completed</span>

                  <input
                    type="checkbox"
                    checked={hideCompleted}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setHideCompleted(checked);
                      localStorage.setItem("hideCompleted", String(checked));
                    }}
                  />
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
                onReorderSubTask={handleReorderSubTasks}
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
                onReorderSubTask={handleReorderSubTasks}
              />
            </div>
          </section>
        </main>
      </div>
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