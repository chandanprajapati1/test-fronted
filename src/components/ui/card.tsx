// components/ui/card.tsx
import * as React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className = "", children, ...props }, ref) => (
        <div
            ref={ref}
            className={`rounded-m border border-neutral-200 bg-white text-neutral-1200 shadow ${className}`}
            {...props}
        >
          {children}
        </div>
    )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className = "", children, ...props }, ref) => (
        <div
            ref={ref}
            className={`flex flex-col space-y-1.5 p-6 ${className}`}
            {...props}
        >
          {children}
        </div>
    )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className = "", children, ...props }, ref) => (
        <h3
            ref={ref}
            className={`font-semibold leading-none tracking-tight ${className}`}
            {...props}
        >
          {children}
        </h3>
    )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className = "", children, ...props }, ref) => (
        <p
            ref={ref}
            className={`text-sm text-neutral-1100 ${className}`}
            {...props}
        >
          {children}
        </p>
    )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className = "", children, ...props }, ref) => (
        <div ref={ref} className={`p-6 pt-6 ${className}`} {...props}>
          {children}
        </div>
    )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className = "", children, ...props }, ref) => (
        <div
            ref={ref}
            className={`flex items-center p-6 pt-0 ${className}`}
            {...props}
        >
          {children}
        </div>
    )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }