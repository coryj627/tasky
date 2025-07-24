import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit3 } from '@phosphor-icons/react'
import { Task, Category } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TaskItemProps {
  task: Task
  categories: Category[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, title: string) => void
}

export function TaskItem({ task, categories, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [isHovered, setIsHovered] = useState(false)

  const category = categories.find(c => c.id === task.category)

  const handleEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onEdit(task.id, editTitle.trim())
    } else {
      setEditTitle(task.title)
    }
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit()
    } else if (e.key === 'Escape') {
      setEditTitle(task.title)
      setIsEditing(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={cn(
        "group transition-all duration-200 hover:shadow-md",
        task.completed && "opacity-75"
      )}>
        <CardContent className="flex items-center gap-3 p-4">
          <Checkbox
            id={task.id}
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleEdit}
                onKeyDown={handleKeyPress}
                className="w-full bg-transparent border-none outline-none text-foreground font-medium"
                autoFocus
              />
            ) : (
              <div
                className={cn(
                  "font-medium transition-all duration-300 cursor-text",
                  task.completed && "line-through text-muted-foreground"
                )}
                onClick={() => setIsEditing(true)}
              >
                {task.title}
              </div>
            )}
            
            {category && (
              <Badge
                variant="secondary"
                className="mt-1 text-xs"
                style={{ 
                  backgroundColor: `color-mix(in oklch, ${category.color} 15%, transparent)`,
                  borderColor: category.color
                }}
              >
                {category.name}
              </Badge>
            )}
          </div>

          <AnimatePresence>
            {(isHovered || isEditing) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex gap-1"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <Edit3 size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}