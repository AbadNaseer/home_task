"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

type TaskStatus = "todo" | "doing" | "done"

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get("title") as string

  if (!title?.trim()) {
    throw new Error("Task title is required")
  }

  const { error } = await supabase.from("tasks").insert({ title: title.trim() })

  if (error) {
    throw new Error("Failed to create task")
  }

  revalidatePath("/tasks")
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const supabase = await createClient()

  const { error } = await supabase.from("tasks").update({ status }).eq("id", id)

  if (error) {
    throw new Error("Failed to update task status")
  }

  revalidatePath("/tasks")
}

export async function deleteTask(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("tasks").delete().eq("id", id)

  if (error) {
    throw new Error("Failed to delete task")
  }

  revalidatePath("/tasks")
}
