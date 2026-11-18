
function TaskForm({ onAddTask, onClose, theme = "dark" }) {
  const isDark = theme === "dark";

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const newTask = {
      id: Date.now(),
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      status: formData.get("status"),
      reminderAt: formData.get("reminderAt") || "",
      reminderNotified: false,
    };

    onAddTask(newTask);
    onClose();
  }

  const inputStyle = `w-full rounded-xl border p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
    isDark
      ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
      : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
  }`;

  const labelStyle = `mb-2 block text-sm font-medium ${
    isDark ? "text-slate-300" : "text-slate-700"
  }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className={`max-h-[90vh] w-full max-w-lg space-y-5 overflow-y-auto rounded-2xl border p-6 shadow-2xl sm:p-8 ${
          isDark
            ? "border-slate-700 bg-[#111A2E]"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Create New Task
            </h2>

            <p
              className={`mt-1 text-sm ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Add and schedule your task.
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

        <div>
          <label className={labelStyle}>Task Title *</label>
          <input
            name="title"
            type="text"
            placeholder="Enter your task title"
            required
            className={inputStyle}
          />
        </div>

        <div>
          <label className={labelStyle}>Description</label>
          <textarea
            name="description"
            placeholder="Describe your task..."
            rows="3"
            className={`${inputStyle} resize-none`}
          />
        </div>

        <div>
          <label className={labelStyle}>Priority</label>
          <select
            name="priority"
            defaultValue="Medium"
            className={inputStyle}
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>

        <div>
          <label className={labelStyle}>Task Status</label>
          <select
            name="status"
            defaultValue="todo"
            className={inputStyle}
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Reminder */}
        <div>
          <label className={labelStyle}>
            <span className="mr-2">🔔</span>
            Set Reminder (Optional)
          </label>

          <input
            name="reminderAt"
            type="datetime-local"
            className={inputStyle}
          />

          <p
            className={`mt-2 text-xs ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Choose the date and time for your task reminder.
          </p>
        </div>

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
            + Create Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
