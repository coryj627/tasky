import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from '@phosphor-icons/react'
import { Category } from '@/lib/types'

interface AddTaskFormProps {
  categories: Category[]
  onAddTask: (title: string, categoryId?: string) => void
}

export function AddTaskForm({ categories, onAddTask }: AddTaskFormProps) {
  const [title, setTitle] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddTask(title.trim(), selectedCategory)
      setTitle('')
      setSelectedCategory(undefined)
      setIsExpanded(false)
    }
  }

  const handleFocus = () => {
    setIsExpanded(true)
  }

  const handleBlur = (e: React.FocusEvent) => {
    // Only collapse if focus is leaving the entire form
    if (!e.currentTarget.contains(e.relatedTarget)) {
      if (!title.trim()) {
        setIsExpanded(false)
      }
    }
  }

  return (
    <motion.div
      layout
      className="mb-6"
    >
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} onBlur={handleBlur}>
            <div className="flex gap-2">
              <Input
                id="new-task"
                type="text"
                placeholder="Add a new task..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={handleFocus}
                className="flex-1"
              />
              
              <Button type="submit" disabled={!title.trim()}>
                <Plus size={16} />
                Add
              </Button>
            </div>
            
            <motion.div
              initial={false}
              animate={{ 
                height: isExpanded ? 'auto' : 0,
                opacity: isExpanded ? 1 : 0 
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}