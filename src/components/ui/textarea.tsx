// components/ui/textarea.tsx
import * as React from "react"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = "", error, ...props }, ref) => {
        const baseStyles = `
      flex min-h-[60px] w-full rounded-m border bg-white px-3 py-2 text-sm 
      shadow-sm placeholder:text-neutral-1100 focus-visible:outline-none 
      focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:cursor-not-allowed 
      disabled:opacity-50
    `

        const borderColor = error
            ? "border-danger"
            : "border-neutral-300"

        return (
            <textarea
                className={`${baseStyles} ${borderColor} ${className}`}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }