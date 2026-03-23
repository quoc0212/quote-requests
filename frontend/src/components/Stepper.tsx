import React from "react";
import "./stepper.css";

interface StepperProps {
  currentStep?: number;
  progress?: number;
}

const steps = [1, 2, 3, 4];

const Stepper: React.FC<StepperProps> = ({
  currentStep = 1,
  progress = 50,
}) => {
  return (
    <div className="stepper">
      {steps.map((step, index) => {
        const isDone = step < currentStep;
        const isActive = step === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step}>
            <div
              className={[
                "stepper__item",
                isDone ? "stepper__item--done" : "",
                isActive ? "stepper__item--active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="stepper__circle">{step}</div>
            </div>

            {!isLast && (
              <div className="stepper__line">
                <div
                  className={[
                    "stepper__line-fill",
                    step < currentStep ? "stepper__line-fill--done" : "",
                    step === currentStep ? "stepper__line-fill--active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{
                    width:
                      step < currentStep
                        ? "100%"
                        : step === currentStep
                          ? `${progress}%`
                          : "0%",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
