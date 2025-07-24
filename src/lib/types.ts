export interface Task {
  id: string
  title: string
  completed: boolean
  category: string
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
}

export type FilterType = 'all' | 'active' | 'completed' | string