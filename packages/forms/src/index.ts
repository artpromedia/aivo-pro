/**
 * @aivo/forms
 * Advanced forms with validation, multi-step, and field arrays
 */

export { useZodForm, useMultiStepForm, useFieldArray } from './hooks';

export {
  FormField,
  TextAreaField,
  SelectField,
  MultiStepProgress,
  MultiStepNavigation,
  FieldArrayItem,
  AddFieldButton,
} from './components';

export type {
  FormFieldProps,
  TextAreaFieldProps,
  SelectFieldProps,
  MultiStepProgressProps,
  MultiStepNavigationProps,
  FieldArrayItemProps,
  AddFieldButtonProps,
} from './components';

export { getErrorMessage, hasError, MultiStepFormManager } from './utils';
export type { StepConfig } from './utils';
