import { motion } from 'framer-motion'
import { CheckCircle, Circle, ClipboardText } from '@phosphor-icons/react'

interface EmptyStateProps {
  filter: string
  hasCategories: boolean
}

export function EmptyState({ filter, hasCategories }: EmptyStateProps) {
  const getEmptyStateContent = () => {
    if (filter === 'completed') {
      return {
        icon: <CheckCircle size={48} className="text-muted-foreground" />,
        title: "No completed tasks",
        description: "Complete some tasks to see them here!"
      }
    } else if (filter === 'active') {
      return {
        icon: <Circle size={48} className="text-muted-foreground" />,
        title: "No active tasks",
        description: "You're all caught up! Add a new task to get started."
      }
    } else if (filter !== 'all' && hasCategories) {
      return {
        icon: <ClipboardText size={48} className="text-muted-foreground" />,
        title: "No tasks in this category",
        description: "Add your first task to this category to get organized!"
      }
    } else {
      return {
        icon: <ClipboardText size={48} className="text-muted-foreground" />,
        title: "No tasks yet",
        description: "Start your productive day by adding your first task!"
      }
    }
  }

  const content = getEmptyStateContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        className="mb-4"
        aria-hidden="true"
      >
        {content.icon}
      </motion.div>
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-lg font-semibold text-foreground mb-2"
      >
        {content.title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="text-muted-foreground max-w-sm"
      >
        {content.description}
      </motion.p>
    </motion.div>
  )
}