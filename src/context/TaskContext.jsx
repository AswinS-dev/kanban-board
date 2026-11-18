
import { useState, useEffect } from "react";
import { TaskContext } from "./TaskContext.js";

const initialTasks = [
  {
    id: 1,
    title: "Learn HTML & CSS",
    description: "Complete basic web development",
    priority: "High",
    status: "todo",
    reminderAt: "",
    reminderNotified: false,
  },
  {
    id: 2,
    title: "Learn JavaScript",
    description: "Practice variables and functions",
    priority: "Medium",
    status: "todo",
    reminderAt: "",
    reminderNotified: false,
  },
  {
    id: 3,
    title: "Build React UI",
    description: "Create the Kanban dashboard",
    priority: "High",
    status: "inprogress",
    reminderAt: "",
    reminderNotified: false,
  },
  {
    id: 4,
    title: "Install Node.js",
    description: "Setup development environment",
    priority: "Low",
    status: "done",
    reminderAt: "",
    reminderNotified: false,
  },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("tasks");
      return savedTasks ? JSON.parse(savedTasks) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(newTask) {
    setTasks((previousTasks) => [
      ...previousTasks,
      {
        ...newTask,
        id: Date.now(),
        status: newTask.status || "todo",
      },
    ]);
  }

  function editTask(updatedTask) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === updatedTask.id
          ? { ...task, ...updatedTask }
          : task
      )
    );
  }

  function deleteTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== taskId)
    );
  }

  function moveTask(taskId, newStatus) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );
  }

  const value = {
    tasks,
    addTask,
    editTask,
    deleteTask,
    moveTask,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}
