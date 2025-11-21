import React from 'react';
import './Form.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = ''
}) => {
  const buttonClassNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    disabled ? 'btn-disabled' : '',
    loading ? 'btn-loading' : '',
    fullWidth ? 'btn-full-width' : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e: React.MouseEvent) => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={buttonClassNames}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading && (
        <span className="btn-spinner">
          <div className="spinner-small spinner-white"></div>
        </span>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left">{icon}</span>
      )}
      
      <span className="btn-content">{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
    </button>
  );
};

export default Button;
