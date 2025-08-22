"use client"

import { startTransition, useOptimistic, useTransition } from "react"
import { createTask, updateTaskStatus, deleteTask } from "@/actions/tasks"
import { TaskItem } from "./task-item"

type Task = {
  id: string
  title: string
  status: "todo" | "doing" | "done"
  created_at: string
  owner: string
}

interface TaskListProps {
  initialTasks: Task[]
}

export function TaskList({ initialTasks }: TaskListProps) {
  const [isAddingTask, startAddTransition] = useTransition()
  const [isUpdatingTask, startUpdateTransition] = useTransition()
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    initialTasks,
    (state: Task[], action: { type: "add" | "update" | "delete"; task?: Partial<Task>; id?: string }) => {
      switch (action.type) {
        case "add":
          return [
            {
              id: `temp-${Date.now()}`,
              title: action.task?.title || "",
              status: "todo" as const,
              created_at: new Date().toISOString(),
              owner: "",
              ...action.task,
            },
            ...state,
          ]
        case "update":
          return state.map((task) => (task.id === action.id ? { ...task, ...action.task } : task))
        case "delete":
          return state.filter((task) => task.id !== action.id)
        default:
          return state
      }
    },
  )

  const handleCreateTask = async (formData: FormData) => {
    const title = formData.get("title") as string
    if (!title.trim()) return

    // Optimistic update
    // addOptimisticTask({
    //   type: "add",
    //   task: { title: title.trim() },
    // })

    // Clear form
    const form = formData.get("form") as unknown as HTMLFormElement
    if (form) form.reset()

    // Server action
    startAddTransition(async () => {
      await createTask(formData)
    })
  }

  const handleUpdateStatus = async (id: string, newStatus: Task["status"]) => {
    // Optimistic update
    // addOptimisticTask({
    //   type: "update",
    //   id,
    //   task: { status: newStatus },
    // })

    // Server action
    startUpdateTransition(async () => {
      await updateTaskStatus(id, newStatus)
    })
  }

  const handleDeleteTask = async (id: string) => {
    // Optimistic update
    // addOptimisticTask({
    //   type: "delete",
    //   id,
    // })

    // Server action
    startUpdateTransition(async () => {
      await deleteTask(id)
    })
  }

  return (
    <div className="space-y-6">
      {/* Add Task Form */}
      <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <form action={handleCreateTask} className="flex gap-4">
          <div className="flex-1">
            <input
              name="title"
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-400 text-slate-900"
              required
              disabled={isAddingTask}
            />
          </div>
          <button
            type="submit"
            disabled={isAddingTask}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingTask ? "Adding..." : "Add Task"}
          </button>
        </form>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "To Do", status: "todo", color: "bg-slate-100 text-slate-700" },
          { label: "Doing", status: "doing", color: "bg-amber-100 text-amber-700" },
          { label: "Done", status: "done", color: "bg-emerald-100 text-emerald-700" },
        ].map(({ label, status, color }) => {
          const count = optimisticTasks.filter((task) => task.status === status).length
          return (
            <div
              key={status}
              className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 text-center"
            >
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                {label}
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">{count}</div>
            </div>
          )
        })}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {optimisticTasks.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No tasks yet</h3>
            <p className="text-slate-500">Add your first task above to get started.</p>
          </div>
        ) : (
          optimisticTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteTask}
              isPending={isUpdatingTask}
            />
          ))
        )}
      </div>
    </div>
  )
}
