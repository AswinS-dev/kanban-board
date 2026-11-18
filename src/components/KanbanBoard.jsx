
import {
  DndContext,
  closestCorners,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

// Task icons based on task title
function getTaskIcon(title = "") {
  const value = title.toLowerCase();

  if (value.includes("study") || value.includes("learn")) return "📖";
  if (value.includes("gym") || value.includes("workout")) return "🏋️";
  if (value.includes("sleep")) return "🛏️";
  if (value.includes("code") || value.includes("react")) return "⚛️";
  if (value.includes("design")) return "🎨";
  if (value.includes("water")) return "☕";
  if (value.includes("project")) return "💻";
  if (value.includes("read")) return "📚";
  if (value.includes("work")) return "💼";

  return "📋";
}

// 1. Individual Task Card
function TaskCard({ task, onEdit, onDelete, onView, theme }) {
  const isDark = theme === "dark";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
    data: {
      status: task.status,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : undefined,
      }
    : undefined;

  const priorityStyles = {
    High: isDark
      ? "border-red-500/50 bg-red-500/15 text-red-400"
      : "border-red-200 bg-red-50 text-red-600",

    Medium: isDark
      ? "border-amber-500/50 bg-amber-500/15 text-amber-400"
      : "border-amber-200 bg-amber-50 text-amber-600",

    Low: isDark
      ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
      : "border-emerald-200 bg-emerald-50 text-emerald-600",
  };

  const icon = getTaskIcon(task.title);

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-2xl border-l-[5px] p-4 transition-all duration-300 ${
        isDragging ? "scale-105 opacity-60 shadow-2xl" : "hover:-translate-y-1"
      } ${
        isDark
          ? "border-l-cyan-400 border-y border-r border-y-blue-400/20 border-r-blue-400/20 bg-gradient-to-br from-[#172653] via-[#14214a] to-[#101a3b] shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:border-y-cyan-400/60 hover:border-r-cyan-400/60 hover:shadow-[0_0_25px_rgba(0,180,255,0.13)]"
          : "border-y border-r border-slate-200 border-l-blue-500 bg-white shadow-lg hover:border-blue-300"
      }`}
    >
      {/* Top row */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl shadow-lg ${
            isDark
              ? "bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-500/20"
              : "bg-blue-100"
          }`}
        >
          {icon}
        </span>

        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          style={{ touchAction: "none" }}
          className={`cursor-grab rounded-lg px-3 py-2 text-lg transition active:cursor-grabbing ${
            isDark
              ? "text-slate-400 hover:bg-white/10 hover:text-cyan-300"
              : "text-slate-400 hover:bg-slate-100"
          }`}
          aria-label={`Drag ${task.title}`}
          title="Drag task"
        >
          ⠿
        </button>
      </div>

      {/* Title */}
      <h3
        onClick={() => onView(task)}
        className={`cursor-pointer break-words text-lg font-bold transition-colors ${
          isDark
            ? "text-white hover:text-cyan-300"
            : "text-slate-800 hover:text-blue-600"
        }`}
      >
        {task.title}
      </h3>

      {/* Description */}
      <p
        className={`mt-2 min-h-6 break-words text-sm leading-6 ${
          isDark ? "text-blue-100/70" : "text-slate-500"
        }`}
      >
        {task.description || "No description added"}
      </p>

      {/* Priority and reminder */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${
            priorityStyles[task.priority] ||
            "border-slate-500/30 bg-slate-500/10 text-slate-400"
          }`}
        >
          {task.priority === "High"
            ? "🔥"
            : task.priority === "Medium"
              ? "⚡"
              : "↓"}
          {task.priority || "Normal"}
        </span>

        {task.reminderAt && !task.reminderNotified && (
          <span className="text-xs text-cyan-400" title="Reminder set">
            🔔 Reminder
          </span>
        )}
      </div>

      {/* Actions */}
      <div
        className={`mt-4 flex justify-end gap-2 border-t pt-3 ${
          isDark ? "border-white/10" : "border-slate-100"
        }`}
      >
        <button
          type="button"
          onClick={() => onEdit(task)}
          title="Edit task"
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg transition hover:scale-110 ${
            isDark
              ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white"
              : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
          }`}
        >
          ✏️
        </button>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          title="Delete task"
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg transition hover:scale-110 ${
            isDark
              ? "bg-fuchsia-500/15 text-fuchsia-400 hover:bg-red-500 hover:text-white"
              : "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
          }`}
        >
          🗑️
        </button>
      </div>
    </article>
  );
}

// 2. Board Column
function BoardColumn({
  column,
  tasks,
  onEdit,
  onDelete,
  onView,
  theme,
}) {
  const isDark = theme === "dark";

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      status: column.id,
    },
  });

  const columnStyles = {
    todo: {
      accent: "bg-cyan-400",
      dot: "bg-cyan-400",
      glow: "shadow-[0_0_35px_rgba(0,200,255,0.12)]",
      badge: "bg-blue-500/30 text-cyan-300",
      border: "border-cyan-500/60",
      icon: "📋",
    },

    inprogress: {
      accent: "bg-fuchsia-500",
      dot: "bg-fuchsia-500",
      glow: "shadow-[0_0_35px_rgba(180,50,255,0.12)]",
      badge: "bg-fuchsia-500/25 text-fuchsia-300",
      border: "border-fuchsia-500/60",
      icon: "⚡",
    },

    done: {
      accent: "bg-emerald-400",
      dot: "bg-emerald-400",
      glow: "shadow-[0_0_35px_rgba(0,255,160,0.10)]",
      badge: "bg-emerald-500/25 text-emerald-300",
      border: "border-emerald-500/60",
      icon: "✓",
    },
  };

  const currentStyle = columnStyles[column.id] || columnStyles.todo;

  return (
    <section
      ref={setNodeRef}
      className={`relative min-h-[500px] overflow-hidden rounded-3xl border p-4 transition-all duration-300 sm:p-5 ${
        isDark
          ? `bg-gradient-to-b from-[#101d43]/95 to-[#080f2c]/95 ${currentStyle.border} ${currentStyle.glow}`
          : "border-slate-200 bg-white shadow-lg"
      } ${
        isOver
          ? "scale-[1.01] ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#080f2c]"
          : ""
      }`}
    >
      {/* Top neon line */}
      <div
        className={`absolute left-0 top-0 h-[3px] w-full ${currentStyle.accent}`}
      />

      {/* Column header */}
      <div className="mb-6 flex items-center justify-between gap-2 px-1 pt-2">
        <div className="flex items-center gap-3">
          <span
            className={`h-8 w-8 rounded-full ${currentStyle.dot} shadow-[0_0_20px_currentColor]`}
          />

          <h2
            className={`text-xl font-extrabold tracking-tight sm:text-2xl ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            {column.title}
          </h2>

          <span
            className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-bold ${currentStyle.badge}`}
          >
            {tasks.length}
          </span>
        </div>

        <span
          className={`text-2xl ${
            isDark ? "text-slate-300" : "text-slate-400"
          }`}
          title="Task column"
        >
          ☰
        </span>
      </div>

      {/* Task cards */}
      <div className="min-h-[390px] space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            theme={theme}
          />
        ))}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div
            className={`flex min-h-[380px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition ${
              isDark
                ? "border-blue-400/40 bg-blue-500/[0.03] text-slate-400"
                : "border-slate-200 bg-slate-50 text-slate-400"
            }`}
          >
            <div
              className={`mb-5 flex h-28 w-28 items-center justify-center rounded-full text-6xl ${
                isDark
                  ? "bg-gradient-to-br from-cyan-500/15 to-violet-500/15 text-cyan-400"
                  : "bg-blue-100 text-blue-500"
              }`}
            >
              {column.id === "done" ? "✓" : "✦"}
            </div>

            <h3
              className={`text-lg font-bold ${
                isDark ? "text-slate-200" : "text-slate-600"
              }`}
            >
              {column.id === "done"
                ? "All clear!"
                : "Drop tasks here"}
            </h3>

            <p className="mt-2 text-sm">
              {column.id === "done"
                ? "Completed tasks will appear here"
                : "Drag your tasks into this column"}
            </p>

            <div className="mt-5 h-1 w-32 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
          </div>
        )}
      </div>
    </section>
  );
}

// 3. Main Kanban Board
function KanbanBoard({
  tasks,
  columns,
  onEdit,
  onDelete,
  onMove,
  onView,
  theme = "dark",
}) {
  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const newStatus = over.data.current?.status;

    if (
      newStatus &&
      active.data.current?.status !== newStatus
    ) {
      onMove(active.id, newStatus);
    }
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <main className="grid grid-cols-1 items-start gap-5 md:grid-cols-3 lg:gap-6">
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            tasks={tasks.filter(
              (task) => task.status === column.id
            )}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            theme={theme}
          />
        ))}
      </main>
    </DndContext>
  );
}

export default KanbanBoard;
