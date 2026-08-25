import { type TextareaHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '../../lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const autoId = useId()
    const textareaId = id ?? autoId
    const describedBy = error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'w-full rounded-md border border-line bg-paper px-4 py-2.5 text-sm leading-relaxed text-ink',
            'placeholder:text-ink-soft/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25',
            'min-h-[100px] resize-y transition-colors',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-200',
            className,
          )}
          {...props}
        />
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="text-xs text-ink-soft/80">{hint}</p>
        )}
        {error && (
          <p id={`${textareaId}-error`} className="text-xs text-red-600">{error}</p>
        )}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'
