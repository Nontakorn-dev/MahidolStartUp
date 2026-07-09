import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary: 'bg-ink text-white hover:bg-ink-soft font-semibold',
  secondary: 'bg-gold text-ink hover:bg-gold-tint font-semibold',
  outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-white font-medium',
  ghost: 'text-ink-soft hover:text-ink hover:bg-line/40 font-medium',
  danger: 'bg-red-600 text-white hover:bg-red-700 font-medium',
}

const sizes = {
  sm: 'px-3.5 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-sm rounded-md',
  lg: 'px-6 py-3 text-sm rounded-md',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
