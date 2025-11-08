/**
 * Form Utilities
 */

import type { FieldError } from 'react-hook-form';

export function getErrorMessage(error?: FieldError): string | undefined {
  if (!error) return undefined;
  return error.message;
}

export function hasError(error?: FieldError): boolean {
  return !!error;
}

export interface StepConfig {
  id: string;
  label: string;
  description?: string;
  fields: string[];
}

export class MultiStepFormManager {
  private steps: StepConfig[];
  private currentStep: number = 0;

  constructor(steps: StepConfig[]) {
    this.steps = steps;
  }

  getCurrentStep(): number {
    return this.currentStep;
  }

  getCurrentStepConfig(): StepConfig {
    return this.steps[this.currentStep];
  }

  getTotalSteps(): number {
    return this.steps.length;
  }

  isFirstStep(): boolean {
    return this.currentStep === 0;
  }

  isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }

  canGoNext(): boolean {
    return !this.isLastStep();
  }

  canGoPrevious(): boolean {
    return !this.isFirstStep();
  }

  goNext(): void {
    if (this.canGoNext()) {
      this.currentStep++;
    }
  }

  goPrevious(): void {
    if (this.canGoPrevious()) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 0 && step < this.steps.length) {
      this.currentStep = step;
    }
  }

  getProgress(): number {
    return ((this.currentStep + 1) / this.steps.length) * 100;
  }

  getAllSteps(): StepConfig[] {
    return this.steps;
  }
}
