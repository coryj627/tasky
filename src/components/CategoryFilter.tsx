import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Settings, X } from '@phosphor-icons/react'
import { Category, FilterType } from '@/lib/types'
import { CATEGORY_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: Category[]
  activeFilter: FilterType
  taskCounts: Record<string, { total: number; completed: number }>
  onFilterChange: (filter: FilterType) => void
  onAddCategory: (name: string, color: string) => void
  onDeleteCategory: (id: string) => void
}

export function CategoryFilter({
  categories,
  activeFilter,
  taskCounts,
  onFilterChange,
  onAddCategory,
  onDeleteCategory
}: CategoryFilterProps) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState(CATEGORY_COLORS[0])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim(), newCategoryColor)
      setNewCategoryName('')
      setNewCategoryColor(CATEGORY_COLORS[0])
      setIsDialogOpen(false)
    }
  }

  const getFilterCount = (filter: FilterType) => {
    if (filter === 'all') {
      return Object.values(taskCounts).reduce((sum, count) => sum + count.total, 0)
    } else if (filter === 'active') {
      return Object.values(taskCounts).reduce((sum, count) => sum + (count.total - count.completed), 0)
    } else if (filter === 'completed') {
      return Object.values(taskCounts).reduce((sum, count) => sum + count.completed, 0)
    } else {
      return taskCounts[filter]?.total || 0
    }
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Filter Tasks</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings size={16} />
              Manage Categories
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Categories</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Add New Category</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  />
                  <Select value={newCategoryColor} onValueChange={setNewCategoryColor}>
                    <SelectTrigger className="w-20">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: newCategoryColor }}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_COLORS.map((color, index) => (
                        <SelectItem key={color} value={color}>
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color }}
                          />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Existing Categories</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteCategory(category.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Default filters */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Badge
            variant={activeFilter === 'all' ? 'default' : 'secondary'}
            className={cn(
              "cursor-pointer transition-colors",
              activeFilter === 'all' && "bg-primary text-primary-foreground"
            )}
            onClick={() => onFilterChange('all')}
          >
            All ({getFilterCount('all')})
          </Badge>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Badge
            variant={activeFilter === 'active' ? 'default' : 'secondary'}
            className={cn(
              "cursor-pointer transition-colors",
              activeFilter === 'active' && "bg-primary text-primary-foreground"
            )}
            onClick={() => onFilterChange('active')}
          >
            Active ({getFilterCount('active')})
          </Badge>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Badge
            variant={activeFilter === 'completed' ? 'default' : 'secondary'}
            className={cn(
              "cursor-pointer transition-colors",
              activeFilter === 'completed' && "bg-primary text-primary-foreground"
            )}
            onClick={() => onFilterChange('completed')}
          >
            Completed ({getFilterCount('completed')})
          </Badge>
        </motion.div>

        {/* Category filters */}
        {categories.map((category) => (
          <motion.div key={category.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge
              variant={activeFilter === category.id ? 'default' : 'secondary'}
              className={cn(
                "cursor-pointer transition-colors",
                activeFilter === category.id && "text-white"
              )}
              style={{
                backgroundColor: activeFilter === category.id ? category.color : undefined,
                borderColor: category.color
              }}
              onClick={() => onFilterChange(category.id)}
            >
              {category.name} ({getFilterCount(category.id)})
            </Badge>
          </motion.div>
        ))}
      </div>
    </div>
  )
}