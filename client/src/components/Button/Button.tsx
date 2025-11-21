import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full-width' : ''} ${loading ? 'btn--loading' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <span className="btn-spinner">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 16a7.978 7.978 0 01-5.657-2.343A7.978 7.978 0 010 8a1 1 0 012 0 6 6 0 106-6 1 1 0 110-2 8 8 0 110 8z"/>
          </svg>
        </span>
      )}
      <span className="btn-content">{children}</span>
    </button>
  );
};

export default Button;
