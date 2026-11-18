
import { useState, useEffect, useRef } from "react";
import TaskForm from "./components/TaskForm";
import EditTaskForm from "./components/EditTaskForm";
import TaskDetailsModal from "./components/TaskDetailsModal";
import KanbanBoard from "./components/KanbanBoard";
import { useTasks } from "./context/useTasks";

// Custom neon checklist logo
function Logo() {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-fuchsia-600 p-[3px] shadow-[0_0_25px_rgba(0,200,255,0.5)]">
      <div className="flex h-full w-full items-center justify-center rounded-[13px] bg-[#07102c]">
        <svg
          viewBox="0 0 64 64"
          className="h-12 w-12"
          fill="none"
        >
          <path
            d="M12 17L18 23L28 12"
            stroke="#00eaff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 34L18 40L28 29"
            stroke="#00eaff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 51L18 57L28 46"
            stroke="#b34cff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M36 18H53M36 35H53M36 52H53"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  // Undo delete feature
const [pendingDelete, setPendingDelete] = useState(null);
const [undoSeconds, setUndoSeconds] = useState(10);

const deleteTimer = useRef(null);
const pendingDeleteRef = useRef(null);
  const [showReminders, setShowReminders] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [notificationPermission, setNotificationPermission] =
    useState(() =>
      "Notification" in window
        ? Notification.permission
        : "unsupported"
    );

  const notifiedIds = useRef(new Set());

  const [theme, setTheme] = useState(
    () => localStorage.getItem("kanban-theme") || "dark"
  );

  const {
    tasks,
    addTask,
    editTask,
    deleteTask,
    moveTask,
  } = useTasks();

  const isDark = theme === "dark";
  // Delete task with 10-second undo option
function handleDelete(taskId) {
  const taskToDelete = tasks.find(
    (task) => task.id === taskId
  );

  if (!taskToDelete) return;

  // Finish any previous pending deletion
  if (deleteTimer.current) {
    clearTimeout(deleteTimer.current);

    if (pendingDeleteRef.current) {
      deleteTask(pendingDeleteRef.current.id);
    }
  }

  // Store the task temporarily
  pendingDeleteRef.current = taskToDelete;
  setPendingDelete(taskToDelete);
  setUndoSeconds(10);

  // Permanently delete after 10 seconds
  deleteTimer.current = setTimeout(() => {
    deleteTask(taskToDelete.id);

    pendingDeleteRef.current = null;
    deleteTimer.current = null;
    setPendingDelete(null);
  }, 10000);
}

// Restore the deleted task
function undoDelete() {
  if (deleteTimer.current) {
    clearTimeout(deleteTimer.current);
  }

  pendingDeleteRef.current = null;
  deleteTimer.current = null;

  setPendingDelete(null);
  setUndoSeconds(10);
}

// Countdown
useEffect(() => {
  if (!pendingDelete) return;

  const interval = setInterval(() => {
    setUndoSeconds((seconds) => Math.max(seconds - 1, 0));
  }, 1000);

  return () => clearInterval(interval);
}, [pendingDelete]);

// Clean up timer when component unmounts
useEffect(() => {
  return () => clearTimeout(deleteTimer.current);
}, []);
  useEffect(() => {
    localStorage.setItem("kanban-theme", theme);
  }, [theme]);

  const columns = [
    { id: "todo", title: "To Do", color: "bg-cyan-400" },
    { id: "inprogress", title: "In Progress", color: "bg-fuchsia-500" },
    { id: "done", title: "Done", color: "bg-emerald-400" },
  ];

  // Search tasks by title or description
  const filteredTasks = tasks.filter((task) => {
    const search = searchText.toLowerCase();

    return (
      task.title?.toLowerCase().includes(search) ||
      task.description?.toLowerCase().includes(search)
    );
  });

  // Pending reminders
  const reminders = tasks
    .filter(
      (task) =>
        task.reminderAt &&
        !task.reminderNotified &&
        task.status !== "done"
    )
    .sort(
      (a, b) =>
        new Date(a.reminderAt) - new Date(b.reminderAt)
    );

  // Enable browser notifications
  async function enableNotifications() {
    if (!("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    } catch (error) {
      console.error("Notification permission error:", error);
    }
  }

  // Check reminders every 5 seconds
  useEffect(() => {
    if (notificationPermission !== "granted") return;

    function checkReminders() {
      const now = Date.now();

      tasks.forEach((task) => {
        if (
          !task.reminderAt ||
          task.reminderNotified ||
          task.status === "done" ||
          notifiedIds.current.has(task.id)
        ) {
          return;
        }

        const reminderTime = new Date(task.reminderAt).getTime();

        if (
          Number.isNaN(reminderTime) ||
          reminderTime > now
        ) {
          return;
        }

        try {
          new Notification("🔔 Task Reminder", {
            body: `It's time for: ${task.title}`,
          });

          notifiedIds.current.add(task.id);

          editTask({
            ...task,
            reminderNotified: true,
          });
        } catch (error) {
          console.error("Could not show notification:", error);
        }
      });
    }

    checkReminders();

    const interval = setInterval(checkReminders, 5000);

    return () => clearInterval(interval);
  }, [tasks, notificationPermission, editTask]);

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
        isDark
          ? "bg-[#050b25] text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Decorative background lights */}
      {isDark && (
        <>
          <div className="pointer-events-none fixed -right-40 -top-48 h-[550px] w-[550px] rounded-full bg-blue-700/20 blur-[130px]" />
          <div className="pointer-events-none fixed -bottom-60 -left-40 h-[600px] w-[600px] rounded-full bg-fuchsia-700/20 blur-[140px]" />
          <div className="pointer-events-none fixed bottom-0 right-0 h-80 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-[1800px] px-4 py-5 sm:px-7 lg:px-9">

        {/* HEADER */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-5 border-b border-blue-500/20 pb-6">

          {/* Logo and title */}
          <div className="flex items-center gap-4">
            <Logo />

            <div className="border-l-2 border-blue-400/60 pl-4">
              <h1 className="text-3xl font-black leading-none tracking-tight sm:text-4xl">
                <span className={isDark ? "text-white" : "text-slate-900"}>
                  Kanban
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent">
                  Board
                </span>
              </h1>

              <div className="mt-2 h-1 w-32 -skew-x-12 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
            </div>
          </div>

          {/* Tagline */}
          <div className="hidden items-center gap-2 xl:flex">
            <span className="text-2xl">🚀</span>
            <p className="text-sm font-medium text-slate-400">
              Organize <span className="text-cyan-400">•</span>{" "}
              Prioritize <span className="text-fuchsia-400">•</span>{" "}
              Achieve
            </p>
          </div>

          {/* Search and actions */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Search */}
            <div className={`flex items-center gap-3 rounded-full border px-4 py-3 transition ${
              isDark
                ? "border-blue-400/50 bg-[#0c1535]/90 focus-within:border-cyan-400"
                : "border-slate-300 bg-white"
            }`}>
              <span className="text-xl">⌕</span>
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search tasks..."
                className={`w-36 bg-transparent text-sm outline-none sm:w-44 ${
                  isDark ? "text-white placeholder:text-slate-400" : "text-slate-900"
                }`}
              />
            </div>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              title="Change theme"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-2xl transition hover:scale-110 hover:border-cyan-400"
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* Add task */}
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-600 px-5 py-3 font-bold text-white shadow-[0_0_25px_rgba(0,130,255,0.3)] transition hover:scale-105 hover:shadow-[0_0_30px_rgba(150,50,255,0.5)]"
            >
              <span className="mr-1 text-xl">+</span> Add Task
            </button>

            {/* Reminder bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowReminders(!showReminders)}
                title="View reminders"
                className="relative flex h-12 w-12 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-xl transition hover:scale-110 hover:border-cyan-400"
              >
                🔔

                {reminders.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                    {reminders.length}
                  </span>
                )}
              </button>

              {/* Reminder dropdown */}
              {showReminders && (
                <div className={`absolute right-0 top-16 z-50 w-80 max-w-[90vw] rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
                  isDark
                    ? "border-blue-400/30 bg-[#0b1433]/95 text-white"
                    : "border-slate-200 bg-white text-slate-900"
                }`}>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-bold">🔔 Reminders</h2>
                    <button
                      type="button"
                      onClick={() => setShowReminders(false)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>

                  {notificationPermission === "default" && (
                    <button
                      type="button"
                      onClick={enableNotifications}
                      className="mb-3 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 p-3 text-sm font-bold text-white"
                    >
                      Enable Notifications
                    </button>
                  )}

                  {notificationPermission === "denied" && (
                    <p className="mb-3 rounded-lg bg-red-500/10 p-3 text-xs text-red-400">
                      Notifications are blocked. Allow them in your browser site settings.
                    </p>
                  )}

                  {notificationPermission === "granted" && (
                    <p className="mb-3 text-xs text-emerald-400">
                      ✓ Browser notifications enabled
                    </p>
                  )}

                  {notificationPermission === "unsupported" && (
                    <p className="mb-3 text-xs text-red-400">
                      Your browser does not support notifications.
                    </p>
                  )}

                  {reminders.length === 0 ? (
                    <p className="py-5 text-center text-sm text-slate-400">
                      No pending reminders.
                    </p>
                  ) : (
                    <div className="max-h-64 space-y-3 overflow-y-auto">
                      {reminders.map((task) => (
                        <div
                          key={task.id}
                          className="rounded-xl border border-blue-400/20 bg-blue-500/10 p-3"
                        >
                          <p className="font-semibold">{task.title}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            📅 {new Date(task.reminderAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-400/30 bg-gradient-to-br from-blue-600 to-indigo-900 text-xl font-bold shadow-lg">
              A
            </div>
          </div>
        </header>

        {/* BOARD */}
        <main>
          <KanbanBoard
            tasks={filteredTasks}
            columns={columns}
            onEdit={(task) => setEditingTask(task)}
            onView={(task) => setSelectedTask(task)}
            onDelete={handleDelete}
            onMove={moveTask}
            theme={theme}
          />
        </main>

        {/* BOTTOM MOTIVATION */}
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 pb-5">
          <div className="flex items-center gap-4 rounded-2xl border border-fuchsia-500/40 bg-gradient-to-r from-fuchsia-500/10 to-blue-500/10 px-5 py-4 shadow-[0_0_25px_rgba(140,50,255,0.12)]">
            <span className="text-3xl">⏰</span>
            <div>
              <p className="font-bold text-fuchsia-400">Stay on track!</p>
              <p className="text-sm text-slate-400">
                Every small step moves you forward.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-blue-400/30 bg-blue-500/10 px-5 py-4">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="font-bold text-amber-400">Keep going!</p>
              <p className="text-sm text-slate-400">
                You're doing great! 💜
              </p>
            </div>
            <span className="text-2xl">📊</span>
          </div>
        </footer>

      </div>

      {/* ADD TASK MODAL */}
      {showForm && (
        <TaskForm
          onAddTask={addTask}
          onClose={() => setShowForm(false)}
          theme={theme}
        />
      )}

      {/* EDIT TASK MODAL */}
      {editingTask && (
        <EditTaskForm
          task={editingTask}
          onUpdate={editTask}
          onClose={() => setEditingTask(null)}
          theme={theme}
        />
      )}

      {/* TASK DETAILS MODAL */}
      {selectedTask && (
        <TaskDetailsModal
          task={
            tasks.find((task) => task.id === selectedTask.id) ||
            selectedTask
          }
          onUpdate={editTask}
          onClose={() => setSelectedTask(null)}
          theme={theme}
        />
      )}
      
{/* UNDO DELETE NOTIFICATION */}
{pendingDelete && (
  <div className="fixed bottom-6 left-6 z-[100] w-[calc(100%-3rem)] max-w-md animate-in slide-in-from-bottom-5 duration-300">
    <div className="flex items-center gap-4 rounded-2xl border border-fuchsia-500/50 bg-[#101936]/95 p-4 shadow-[0_0_30px_rgba(150,50,255,0.25)] backdrop-blur-xl">

      {/* Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-blue-600 text-2xl">
        🗑️
      </div>

      {/* Message */}
      <div className="min-w-0 flex-1">
        <p className="font-bold text-white">
          Task deleted!
        </p>

        <p className="truncate text-sm text-slate-400">
          {pendingDelete.title}
        </p>

        <p className="mt-1 text-xs text-cyan-400">
          Permanently deleting in {undoSeconds}s
        </p>
      </div>

      {/* Undo button */}
      <button
        type="button"
        onClick={undoDelete}
        className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 font-bold text-white shadow-lg transition hover:scale-105 hover:from-cyan-400 hover:to-blue-500"
      >
        UNDO
      </button>

    </div>
  </div>
)}
</div>
  );
}

export default App;
