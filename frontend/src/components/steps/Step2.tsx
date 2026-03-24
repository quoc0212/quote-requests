import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Step2Data } from "../../types/form";
import Stepper from "../Stepper";
import { PRIMARY_COLOR_1 } from "../../constants";

const SERVICE_OPTIONS = [
  { value: "Development", icon: "/icons/development_icon.svg" },
  { value: "Web Design", icon: "/icons/web_design_icon.svg" },
  { value: "Marketing", icon: "/icons/marketing_icon.svg" },
  { value: "Other", icon: "/icons/other_icon.svg" },
] as const;

interface Props {
  defaultValues: Step2Data;
  onNext: (data: Step2Data) => void;
  onBack: () => void;
  currentStep: number;
}

const Step2: React.FC<Props> = ({
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
  } = useForm<Step2Data>({ defaultValues, mode: "onChange" });

  const selectedService = watch("service");
  const showOther = selectedService === "Other";

  return (
    <form id="step2-form" onSubmit={handleSubmit(onNext)} noValidate>
      <Stepper currentStep={currentStep} />
      <hr className="stepper-divider" />
      <div className="form-card__header">
        <h2 className="form-card__title">{t("step2.title")}</h2>
        <p className="form-card__subtitle">{t("step2.subtitle")}</p>
      </div>

      <div className="services-grid" role="radiogroup">
        {SERVICE_OPTIONS.map(({ value, icon }) => {
          const isSelected = selectedService === value;
          return (
            <div className="service-card" key={value}>
              <input
                type="radio"
                id={`service-${value}`}
                value={value}
                className="service-card__input"
                {...register("service", { required: t("validation.required") })}
              />
              <label
                htmlFor={`service-${value}`}
                className="service-card__label"
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
                <img src={icon} alt={value} className="service-card__icon" />
                <span
                  className="service-card__name"
                  style={isSelected ? { color: PRIMARY_COLOR_1 } : undefined}
                >
                  {t(`step2.services.${value}`) || value}
                </span>
              </label>
            </div>
          );
        })}
      </div>

      {errors.service && (
        <div className="form-error mb-2">{errors.service.message}</div>
      )}

      {showOther && (
        <div className="form-group other-service-input">
          <label className="form-label" htmlFor="other_service">
            {t("step2.other")} <span className="form-label__required">*</span>
          </label>
          <input
            id="other_service"
            type="text"
            placeholder={t("step2.otherPlaceholder")}
            className={`form-input${errors.other_service ? " error" : ""}`}
            {...register("other_service", {
              required: showOther ? t("validation.required") : false,
            })}
          />
          {errors.other_service && (
            <span className="form-error">{errors.other_service.message}</span>
          )}
        </div>
      )}
    </form>
  );
};

export default Step2;
