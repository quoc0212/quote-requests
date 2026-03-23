import React from 'react';
import { useTranslation } from 'react-i18next';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS_KEYS = ['1', '2', '3', '4', '5'] as const;

const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps }) => {
  const { t } = useTranslation();

  return (
    <div className="stepper" role="list" aria-label="Form progress">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;

        return (
          <div
            key={step}
            role="listitem"
            className={`stepper__item${isActive ? ' stepper__item--active' : ''}${isCompleted ? ' stepper__item--completed' : ''}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <div className="stepper__circle">
              {isCompleted ? '✓' : step}
            </div>
            <span className="stepper__label">
              {t(`steps.${STEP_LABELS_KEYS[i]}`)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
