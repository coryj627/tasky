import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { Separator } from '@/components/ui/separator'
import { AddTaskForm } from '@/components/AddTaskForm'
import { TaskItem } from '@/components/TaskItem'
import { CategoryFilter } from '@/components/CategoryFilter'
import { EmptyState } from '@/components/EmptyState'
import { Task, Category, FilterType } from '@/lib/types'
import { DEFAULT_CATEGORIES } from '@/lib/constants'
import { toast } from 'sonner'

function App() {
  const [tasks, setTasks] = useKV<Task[]>('taskflow-tasks', [])
  const [categories, setCategories] = useKV<Category[]>('taskflow-categories', DEFAULT_CATEGORIES)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const taskCounts = useMemo(() => {
    const counts: Record<string, { total: number; completed: number }> = {}
    
    categories.forEach(category => {
      const categoryTasks = tasks.filter(task => task.category === category.id)
      counts[category.id] = {
        total: categoryTasks.length,
        completed: categoryTasks.filter(task => task.completed).length
      }
    })
    
    return counts
  }, [tasks, categories])

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'all') {
      return tasks
    } else if (activeFilter === 'active') {
      return tasks.filter(task => !task.completed)
    } else if (activeFilter === 'completed') {
      return tasks.filter(task => task.completed)
    } else {
      return tasks.filter(task => task.category === activeFilter)
    }
  }, [tasks, activeFilter])

  const handleAddTask = (title: string, categoryId?: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      completed: false,
      category: categoryId || 'personal',
      createdAt: new Date()
    }

    setTasks(currentTasks => [...currentTasks, newTask])
    toast.success('Task added successfully!')
  }

  const handleToggleTask = (id: string) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
    
    const task = tasks.find(t => t.id === id)
    if (task) {
      toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed! 🎉')
    }
  }

  const handleDeleteTask = (id: string) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== id))
    toast.success('Task deleted')
  }

  const handleEditTask = (id: string, newTitle: string) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    )
    toast.success('Task updated')
  }

  const handleAddCategory = (name: string, color: string) => {
    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase() === name.toLowerCase()
    )
    
    if (existingCategory) {
      toast.error('Category already exists')
      return
    }

    const newCategory: Category = {
      id: `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      color
    }

    setCategories(currentCategories => [...currentCategories, newCategory])
    toast.success('Category added successfully!')
  }

  const handleDeleteCategory = (id: string) => {
    const categoryTasks = tasks.filter(task => task.category === id)
    if (categoryTasks.length > 0) {
      toast.error('Cannot delete category with existing tasks')
      return
    }

    setCategories(currentCategories => 
      currentCategories.filter(category => category.id !== id)
    )
    toast.success('Category deleted')
  }

  const completedTasks = filteredTasks.filter(task => task.completed)
  const activeTasks = filteredTasks.filter(task => !task.completed)

  return (
    <div className="min-h-screen bg-background">
      {/* Skip link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Skip to main content
      </a>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
          role="banner"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">TaskFlow</h1>
          <p className="text-muted-foreground">Organize your day, one task at a time</p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <AddTaskForm categories={categories} onAddTask={handleAddTask} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <CategoryFilter
            categories={categories}
            activeFilter={activeFilter}
            taskCounts={taskCounts}
            onFilterChange={setActiveFilter}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </motion.div>

        <div id="main-content" className="space-y-6" role="main" aria-label="Task list">
          {filteredTasks.length === 0 ? (
            <EmptyState filter={activeFilter} hasCategories={categories.length > 0} />
          ) : (
            <>
              {/* Active Tasks */}
              {activeTasks.length > 0 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  aria-labelledby={activeFilter === 'all' ? 'active-tasks-heading' : undefined}
                >
                  {activeFilter === 'all' && (
                    <h2 id="active-tasks-heading" className="text-lg font-semibold text-foreground mb-4">
                      Active Tasks ({activeTasks.length})
                    </h2>
                  )}
                  <div className="space-y-3">
                    <AnimatePresence>
                      {activeTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          categories={categories}
                          onToggle={handleToggleTask}
                          onDelete={handleDeleteTask}
                          onEdit={handleEditTask}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.section>
              )}

              {/* Separator between active and completed */}
              {activeTasks.length > 0 && completedTasks.length > 0 && activeFilter === 'all' && (
                <Separator className="my-6" />
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  aria-labelledby={activeFilter === 'all' ? 'completed-tasks-heading' : undefined}
                >
                  {activeFilter === 'all' && (
                    <h2 id="completed-tasks-heading" className="text-lg font-semibold text-muted-foreground mb-4">
                      Completed Tasks ({completedTasks.length})
                    </h2>
                  )}
                  <div className="space-y-3">
                    <AnimatePresence>
                      {completedTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          categories={categories}
                          onToggle={handleToggleTask}
                          onDelete={handleDeleteTask}
                          onEdit={handleEditTask}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.section>
              )}
            </>
          )}
        </div>
      </div>
      
      <Toaster position="bottom-right" />
    </div>
  )
}

export default App