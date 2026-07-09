import { cn } from '../../lib/utils'
import { INDUSTRY_COLORS, DEFAULT_INDUSTRY_COLOR } from '../../types/msc-connect'

interface CategoryFilterBarProps {
  categories: { key: string; label: string }[]
  active: string
  onChange: (key: string) => void
  className?: string
}

export function CategoryFilterBar({ categories, active, onChange, className }: CategoryFilterBarProps) {
  return (
    <div className={cn('category-filter', className)}>
      <button
        type="button"
        onClick={() => onChange('')}
        className={cn('category-filter__pill', !active && 'category-filter__pill--active')}
      >
        ทั้งหมด
      </button>
      {categories.map((cat) => (
        <button
          key={cat.key}
          type="button"
          onClick={() => onChange(cat.key)}
          className={cn(
            'category-filter__pill',
            active === cat.key && 'category-filter__pill--active',
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}

export function industryBadgeClass(tagKey: string) {
  return INDUSTRY_COLORS[tagKey] ?? DEFAULT_INDUSTRY_COLOR
}
