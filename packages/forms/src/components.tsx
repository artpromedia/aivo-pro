/**
 * Form Components
 */

import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import type { FieldError, UseFormRegister } from 'react-hook-form';
import { getErrorMessage } from './utils';

export interface FormFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function FormField({
  label,
  name,
  register,
  error,
  type = 'text',
  placeholder,
  required,
  className = '',
}: FormFieldProps) {
  const errorMessage = getErrorMessage(error);

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <input
        id={name}
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-coral
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />
      
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}

export interface TextAreaFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export function TextAreaField({
  label,
  name,
  register,
  error,
  placeholder,
  required,
  rows = 4,
  className = '',
}: TextAreaFieldProps) {
  const errorMessage = getErrorMessage(error);

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <textarea
        id={name}
        {...register(name)}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full px-3 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-coral
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />
      
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}

export interface SelectFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function SelectField({
  label,
  name,
  register,
  error,
  options,
  placeholder,
  required,
  className = '',
}: SelectFieldProps) {
  const errorMessage = getErrorMessage(error);

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <select
        id={name}
        {...register(name)}
        className={`
          w-full px-3 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-coral
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}

export interface MultiStepProgressProps {
  steps: { id: string; label: string }[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function MultiStepProgress({
  steps,
  currentStep,
  onStepClick,
  className = '',
}: MultiStepProgressProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <button
              type="button"
              onClick={() => onStepClick?.(index)}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                font-semibold transition-colors
                ${
                  index === currentStep
                    ? 'bg-coral text-white'
                    : index < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }
              `}
            >
              {index + 1}
            </button>
            
            <div className="ml-3 flex-1">
              <p
                className={`text-sm font-medium ${
                  index === currentStep ? 'text-coral' : 'text-gray-600'
                }`}
              >
                {step.label}
              </p>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-4 ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export interface MultiStepNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  submitLabel?: string;
  className?: string;
}

export function MultiStepNavigation({
  isFirstStep,
  isLastStep,
  onPrevious,
  onNext,
  onSubmit,
  nextLabel = 'Next',
  previousLabel = 'Previous',
  submitLabel = 'Submit',
  className = '',
}: MultiStepNavigationProps) {
  return (
    <div className={`flex justify-between ${className}`}>
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="
          px-4 py-2 rounded-lg border border-gray-300
          hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center gap-2
        "
      >
        <ChevronLeft className="w-4 h-4" />
        {previousLabel}
      </button>

      {isLastStep ? (
        <button
          type="submit"
          onClick={onSubmit}
          className="
            px-6 py-2 rounded-lg bg-coral text-white
            hover:bg-coral-dark transition-colors
          "
        >
          {submitLabel}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="
            px-4 py-2 rounded-lg bg-coral text-white
            hover:bg-coral-dark transition-colors
            flex items-center gap-2
          "
        >
          {nextLabel}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export interface FieldArrayItemProps {
  index: number;
  onRemove: () => void;
  children: React.ReactNode;
  showRemove?: boolean;
  className?: string;
}

export function FieldArrayItem({
  index,
  onRemove,
  children,
  showRemove = true,
  className = '',
}: FieldArrayItemProps) {
  return (
    <div className={`border rounded-lg p-4 mb-3 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium">Item {index + 1}</h4>
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export interface AddFieldButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function AddFieldButton({
  onClick,
  label = 'Add Item',
  className = '',
}: AddFieldButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg border-2 border-dashed border-gray-300
        hover:border-coral hover:text-coral transition-colors
        flex items-center gap-2 ${className}
      `}
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}
