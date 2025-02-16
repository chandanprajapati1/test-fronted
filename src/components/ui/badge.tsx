import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
}

export function Badge({
                          children,
                          variant = 'default',
                          className = '',
                          ...props
                      }: BadgeProps) {
    const baseStyles = 'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition-colors';

    const variantStyles = {
        default: 'bg-primary/10 text-primary ring-primary/20',
        secondary: 'bg-secondary/10 text-secondary ring-secondary/20',
        success: 'bg-success/10 text-success ring-success/20',
        warning: 'bg-warning/10 text-warning ring-warning/20',
        danger: 'bg-danger/10 text-danger ring-danger/20',
        info: 'bg-info/10 text-info ring-info/20',
        outline: 'text-neutral-900 ring-neutral-200'
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

    return (
        <div className={combinedClassName} {...props}>
            {children}
        </div>
    );
}

export default Badge;