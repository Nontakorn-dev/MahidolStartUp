import { cn } from '../../lib/utils'

export function Card({
  children,
  className,
  hover = false,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-line/60 bg-surface p-6',
        hover && 'card-elevated cursor-pointer border-transparent !p-6',
        !hover && 'shadow-sm',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}
