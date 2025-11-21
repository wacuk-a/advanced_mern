import React, { useState } from 'react';
import './Form.css';

export interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea';
  name: string;
  value: string;
  onChange: (value: string, name: string) => void;
  onBlur?: (value: string, name: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  helpText?: string;
  icon?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  helpText,
  icon,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value, name);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    setIsTouched(true);
    if (onBlur) {
      onBlur(e.target.value, name);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const showError = isTouched && error;

  const inputClassNames = [
    'form-input',
    showError ? 'form-input-error' : '',
    isFocused ? 'form-input-focused' : '',
    disabled ? 'form-input-disabled' : '',
    icon ? 'form-input-with-icon' : '',
    className
  ].filter(Boolean).join(' ');

  const renderInput = () => {
    const commonProps = {
      id: name,
      name,
      value,
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
      placeholder,
      disabled,
      required,
      autoComplete,
      maxLength,
      minLength,
      pattern,
      className: 'form-input-field'
    };

    if (type === 'textarea') {
      return <textarea {...commonProps} rows={4} />;
    }

    return <input type={type} {...commonProps} />;
  };

  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="form-required">*</span>}
      </label>
      
      <div className={inputClassNames}>
        {icon && <span className="form-input-icon">{icon}</span>}
        {renderInput()}
      </div>

      {showError && (
        <div className="form-error">{error}</div>
      )}

      {helpText && !showError && (
        <div className="form-help">{helpText}</div>
      )}

      {maxLength && (
        <div className="form-character-count">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
};

export default Input;
