'use client';

import React from 'react';
import Button from './Button';

type FormProps = {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string;
  success?: string;
  footerClassName?: string;
  submitButtonClassName?: string;
  cancelButtonClassName?: string;
  hideFooter?: boolean;
};

const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  className = '',
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
  isLoading = false,
  error,
  success,
  footerClassName = '',
  submitButtonClassName = '',
  cancelButtonClassName = '',
  hideFooter = false
}) => {
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };
  
  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {/* Form content */}
      <div className="space-y-4">{children}</div>
      
      {/* Success message */}
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Form footer */}
      {!hideFooter && (
        <div className={`mt-6 flex justify-end space-x-3 ${footerClassName}`}>
          {onCancel && (
            <Button
              type="button"
              variant="light"
              onClick={onCancel}
              disabled={isLoading}
              className={cancelButtonClassName}
            >
              {cancelText}
            </Button>
          )}
          
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
            className={submitButtonClassName}
          >
            {submitText}
          </Button>
        </div>
      )}
    </form>
  );
};

export default Form;
