import { createClient } from "@/utils/supabase/server"
import { TaskList } from "@/components/task-list"
import { logout } from "@/actions/logout"

type Task = {
  id: string
  title: string
  status: "todo" | "doing" | "done"
  created_at: string
  owner: string
}

async function getTasks(): Promise<Task[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })

  if (error) {
    return []
  }
  return data as Task[]
}

async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export default async function TasksPage() {
  const tasks = await getTasks()
  const user = await getUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-900">Tasks</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">{user?.email}</span>
            <form action={logout}>
              <button className="text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <TaskList initialTasks={tasks} />
      </div>
    </div>
  )
}
