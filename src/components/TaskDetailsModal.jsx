
import { useState } from "react";

function TaskDetailsModal({ task, onUpdate, onClose, theme = "dark" }) {
  const isDark = theme === "dark";

  const [description, setDescription] = useState(
    task.description || ""
  );

  const [status, setStatus] = useState(task.status);

  function handleSubmit(event) {
    event.preventDefault();

    onUpdate({
      ...task,
      description,
      status,
    });

    onClose();
  }

  const inputStyle = `w-full rounded-xl border p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
    isDark
      ? "border-slate-700 bg-slate-900 text-white"
      : "border-slate-300 bg-white text-slate-900"
  }`;

  const labelStyle = `mb-2 block text-sm font-medium ${
    isDark ? "text-slate-300" : "text-slate-700"
  }`;

  const priorityStyles = {
    High: "bg-red-500/15 text-red-400 border-red-500/30",
    Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    Low: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };

  const statusLabels = {
    todo: "To Do",
    inprogress: "In Progress",
    done: "Done",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl sm:p-8 ${
          isDark
            ? "border-slate-700 bg-[#111A2E]"
            : "border-slate-200 bg-white"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Task Details
            </h2>

            <p
              className={`mt-1 text-sm ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              View and update your task.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg px-3 py-2 text-xl ${
              isDark
                ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            ✕
          </button>
        </div>

        {/* Task Title */}
        <div className="mb-5">
          <h3
            className={`mb-3 text-xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {task.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-lg border px-3 py-1 text-xs font-semibold ${
                priorityStyles[task.priority] ||
                priorityStyles.Medium
              }`}
            >
              {task.priority || "Medium"} Priority
            </span>

            <span
              className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                isDark
                  ? "bg-blue-500/15 text-blue-400"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {statusLabels[task.status] || task.status}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Description */}
          <div>
            <label className={labelStyle}>
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows="4"
              placeholder="Add task description..."
              className={`${inputStyle} resize-none`}
            />
          </div>

          {/* Status */}
          <div>
            <label className={labelStyle}>
              Update Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className={inputStyle}
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-xl px-5 py-3 font-semibold transition ${
                isDark
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              Close
            </button>

            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskDetailsModal;
