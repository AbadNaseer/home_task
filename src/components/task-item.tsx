"use client"

import { useState } from "react"
import { ChevronDownIcon, TrashIcon } from "@heroicons/react/24/outline"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"

type Task = {
  id: string
  title: string
  status: "todo" | "doing" | "done"
  created_at: string
  owner: string
}

interface TaskItemProps {
  task: Task
  onUpdateStatus: (id: string, status: Task["status"]) => void
  onDelete: (id: string) => void
  isPending: boolean
}

const statusConfig = {
  todo: {
    label: "To Do",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    dotColor: "bg-slate-400",
  },
  doing: {
    label: "Doing",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    dotColor: "bg-amber-400",
  },
  done: {
    label: "Done",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-400",
  },
}

export function TaskItem({ task, onUpdateStatus, onDelete, isPending }: TaskItemProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const currentStatus = statusConfig[task.status]

  const handleStatusChange = (newStatus: Task["status"]) => {
    onUpdateStatus(task.id, newStatus)
    setIsDropdownOpen(false)
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-xl p-5 hover:shadow-md transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Status Indicator */}
          <div className={`w-3 h-3 rounded-full ${currentStatus.dotColor} flex-shrink-0`} />

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <p
              className={`font-medium text-lg leading-tight ${
                task.status === "done" ? "text-slate-500 line-through" : "text-slate-900"
              }`}
            >
              {task.title}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {new Date(task.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <div className={`w-2 h-2 rounded-full ${currentStatus.dotColor}`} />
                {currentStatus.label}
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.entries(statusConfig).map(([status, config]) => (
                <DropdownMenuItem key={status} onClick={() => handleStatusChange(status as Task["status"])}>
                  <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                  {config.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isPending}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all hover:shadow-sm disabled:opacity-50 ${currentStatus.color}`}
            >
              {currentStatus.label}
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (

              <div className="absolute right-0 top-full mt-2 z-[9999] w-32 bg-white border border-slate-200 rounded-lg shadow-lg">
                {Object.entries(statusConfig).map(([status, config]) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status as Task["status"])}
                    className={`w-full text-left px-3 py-2 z-[9999] text-sm hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                      status === task.status ? "bg-slate-50 font-medium" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                      {config.label}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div> */}

          {/* Delete Button */}
          <button
            onClick={() => onDelete(task.id)}
            disabled={isPending}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
            title="Delete task"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
