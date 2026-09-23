import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-foreground-muted">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 pointer-events-none text-foreground-subtle flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-surface text-foreground placeholder:text-foreground-subtle text-sm rounded-lg border border-border px-3 py-2 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground disabled:opacity-50 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-9' : ''
            } ${rightIcon ? 'pr-9' : ''} ${
              error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-foreground-subtle flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-foreground-subtle">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
