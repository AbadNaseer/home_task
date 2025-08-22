import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

type Task = {
  id: string
  title: string
  status: 'todo' | 'doing' | 'done'
  created_at: string
  owner: string
}

async function getTasks(): Promise<Task[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }
  return data as Task[]
}

export default async function TasksPage() {
  const tasks = await getTasks()

  async function createTask(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const title = formData.get('title') as string
    await supabase.from('tasks').insert({ title })
    revalidatePath('/tasks')
  }

  async function updateTaskStatus(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const id = formData.get('id') as string
    const status = formData.get('status') as Task['status']
    await supabase.from('tasks').update({ status }).eq('id', id)
    revalidatePath('/tasks')
  }

  async function deleteTask(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const id = formData.get('id') as string
    await supabase.from('tasks').delete().eq('id', id)
    revalidatePath('/tasks')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-emerald-50 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-gray-900">Your Tasks</h1>
        <p className="mt-1 text-sm text-gray-500">Only you can see and manage these.</p>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <form action={createTask} className="flex items-center gap-3">
            <input
              name="title"
              placeholder="Add a new task..."
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
            <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              Add
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-3">
          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
              No tasks yet. Add your first task above.
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-500">{new Date(task.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <form action={updateTaskStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={task.id} />
                    <select
                      name="status"
                      defaultValue={task.status}
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                    >
                      <option value="todo">Todo</option>
                      <option value="doing">Doing</option>
                      <option value="done">Done</option>
                    </select>
                    <button className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1 text-sm hover:bg-gray-100">
                      Update
                    </button>
                  </form>
                  <form action={deleteTask}>
                    <input type="hidden" name="id" value={task.id} />
                    <button className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700">Delete</button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}


