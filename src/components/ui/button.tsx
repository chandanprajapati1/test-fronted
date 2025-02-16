// components/ui/button.tsx
import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className = "",
            variant = "default",
            size = "default",
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = "inline-flex items-center justify-center rounded-m text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50"

        const variants = {
            default: "bg-primary text-white hover:bg-brand1-600",
            destructive: "bg-danger text-white hover:bg-red-600",
            outline: "border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-1200",
            secondary: "bg-secondary text-white hover:bg-secondary/90",
            ghost: "hover:bg-neutral-100 text-neutral-1200",
            link: "text-primary underline-offset-4 hover:underline"
        }

        const sizes = {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-m px-3 text-xs",
            lg: "h-10 rounded-m px-8",
            icon: "h-9 w-9"
        }

        const variantStyles = variants[variant]
        const sizeStyles = sizes[size]

        return (
            <button
                className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
                ref={ref}
                disabled={disabled}
                {...props}
            >
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }