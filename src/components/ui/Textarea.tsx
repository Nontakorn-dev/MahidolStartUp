import { type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={cn(
          'w-full rounded-md border border-line bg-paper px-4 py-2.5 text-sm text-ink',
          'placeholder:text-ink-soft/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30',
          'min-h-[100px] resize-y',
          error && 'border-red-400',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  ),
)
Textarea.displayName = 'Textarea'
