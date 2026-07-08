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
        'rounded-lg border border-line bg-paper p-6',
        hover && 'transition-colors hover:border-gold/40 hover:bg-gold-tint/20',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}
