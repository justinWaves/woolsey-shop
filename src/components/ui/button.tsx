import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-xl transform hover:scale-105',
      secondary: 'bg-surface text-foreground hover:bg-surface/80 border border-border shadow-md hover:shadow-lg',
      outline: 'border-2 border-accent bg-transparent hover:bg-accent hover:text-white text-accent font-semibold',
      ghost: 'hover:bg-surface/50 text-foreground',
    };
    
    const sizes = {
      sm: 'h-9 px-4 text-sm rounded-lg',
      md: 'h-11 px-6 text-base rounded-lg',
      lg: 'h-12 px-8 text-base rounded-lg',
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

