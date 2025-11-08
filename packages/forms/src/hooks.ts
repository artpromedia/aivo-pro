/**
 * Form Hooks
 */

import { useState } from 'react';
import { 
  useForm as useReactHookForm, 
  useFieldArray as useReactHookFormFieldArray,
  type UseFormProps, 
  type UseFormReturn 
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodSchema } from 'zod';
import { MultiStepFormManager, type StepConfig } from './utils';

export function useZodForm<TFieldValues extends Record<string, any>>(
  schema: ZodSchema<TFieldValues>,
  options?: Omit<UseFormProps<TFieldValues>, 'resolver'>
): UseFormReturn<TFieldValues> {
  return useReactHookForm<TFieldValues>({
    resolver: zodResolver(schema),
    ...options,
  });
}

export function useMultiStepForm<TFieldValues extends Record<string, any>>(
  steps: StepConfig[],
  schema?: ZodSchema<TFieldValues>,
  options?: Omit<UseFormProps<TFieldValues>, 'resolver'>
) {
  const [manager] = useState(() => new MultiStepFormManager(steps));
  const [currentStep, setCurrentStep] = useState(0);

  const form = useReactHookForm<TFieldValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    mode: 'onChange',
    ...options,
  });

  const nextStep = async () => {
    const currentStepConfig = manager.getCurrentStepConfig();
    const isValid = await form.trigger(currentStepConfig.fields as any);
    
    if (isValid && manager.canGoNext()) {
      manager.goNext();
      setCurrentStep(manager.getCurrentStep());
    }
    
    return isValid;
  };

  const previousStep = () => {
    if (manager.canGoPrevious()) {
      manager.goPrevious();
      setCurrentStep(manager.getCurrentStep());
    }
  };

  const goToStep = (step: number) => {
    manager.goToStep(step);
    setCurrentStep(manager.getCurrentStep());
  };

  return {
    form,
    currentStep,
    currentStepConfig: manager.getCurrentStepConfig(),
    totalSteps: manager.getTotalSteps(),
    isFirstStep: manager.isFirstStep(),
    isLastStep: manager.isLastStep(),
    progress: manager.getProgress(),
    steps: manager.getAllSteps(),
    nextStep,
    previousStep,
    goToStep,
  };
}

export function useFieldArray<TFieldValues extends Record<string, any>>(
  name: string,
  control: any
) {
  const { fields, append, remove, move, insert, update } = 
    useReactHookFormFieldArray({ control, name });

  return {
    fields,
    append,
    remove,
    move,
    insert,
    update,
  };
}
