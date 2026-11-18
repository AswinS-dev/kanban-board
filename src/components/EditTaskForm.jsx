
import { useState } from "react";

function EditTaskForm({ task, onUpdate, onClose, theme = "dark" }) {
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority || "Medium",
    status: task.status,
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a task title");
      return;
    }

    onUpdate({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      id: task.id,
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
              Edit Task
            </h2>

            <p
              className={`mt-1 text-sm ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Update your task details.
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className={labelStyle}>Task Title *</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelStyle}>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`${inputStyle} resize-none`}
              placeholder="Describe your task..."
            />
          </div>

          {/* Priority */}
          <div>
            <label className={labelStyle}>Priority</label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className={labelStyle}>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
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
              Cancel
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

export default EditTaskForm;
