import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Step3Data, BUDGET_OPTIONS } from "../../types/form";
import Stepper from "../Stepper";
import { PRIMARY_COLOR_1 } from "../../constants";

interface Props {
  defaultValues: Step3Data;
  onNext: (data: Step3Data) => void;
  onBack: () => void;
  currentStep: number;
}

const Step3: React.FC<Props> = ({
  defaultValues,
  onNext,
  onBack,
  currentStep,
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step3Data>({ defaultValues });

  const selectedBudget = watch("budget");

  return (
    <form id="step3-form" onSubmit={handleSubmit(onNext)} noValidate>
      <Stepper currentStep={currentStep} />
      <hr className="stepper-divider" />
      <div className="form-card__header">
        <h2 className="form-card__title">{t("step3.title")}</h2>
        <p className="form-card__subtitle">{t("step3.subtitle")}</p>
      </div>

      <div className="budget-grid" role="radiogroup">
        {BUDGET_OPTIONS.map((opt) => {
          const isSelected = selectedBudget === opt;
          return (
            <div className="budget-card" key={opt}>
              <input
                type="radio"
                id={`budget-${opt}`}
                value={opt}
                className="budget-card__input"
                {...register("budget", { required: t("validation.required") })}
              />
              <label
                htmlFor={`budget-${opt}`}
                className="budget-card__label"
                style={
                  isSelected
                    ? {
                        borderColor: PRIMARY_COLOR_1,
                        backgroundColor: "rgba(74, 58, 255, 0.08)",
                        boxShadow: "0 0 0 3px rgba(74, 58, 255, 0.15)",
                      }
                    : undefined
                }
              >
                <span className="budget-card__radio" />
                <span
                  className="budget-card__name"
                  style={
                    isSelected
                      ? { color: PRIMARY_COLOR_1, fontWeight: 600 }
                      : undefined
                  }
                >
                  {t(`step3.budgetOptions.${opt}`) || opt}
                </span>
              </label>
            </div>
          );
        })}
      </div>

      {errors.budget && (
        <div className="form-error mb-2">{errors.budget.message}</div>
      )}
    </form>
  );
};

export default Step3;
