import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Step1Data } from "../../types/form";
import Stepper from "../Stepper";

interface Props {
  defaultValues: Step1Data;
  onNext: (data: Step1Data) => void;
  currentStep: number;
}

const Step1: React.FC<Props> = ({ defaultValues, onNext, currentStep }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Data>({ defaultValues, mode: "onBlur" });

  return (
    <form id="step1-form" onSubmit={handleSubmit(onNext)} noValidate>
      <Stepper currentStep={currentStep} />
      <hr className="stepper-divider" />
      <div className="form-card__header">
        <h2 className="form-card__title">{t("step1.title")}</h2>
        <p className="form-card__subtitle">{t("step1.subtitle")}</p>
      </div>

      <div className="form-grid">
        {/* Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            {t("step1.name")} <span className="form-label__required">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder={t("step1.namePlaceholder")}
            className={`form-input${errors.name ? " error" : ""}`}
            autoComplete="name"
            {...register("name", { required: t("validation.required") })}
          />
          {errors.name && (
            <span className="form-error">{errors.name.message}</span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            {t("step1.email")} <span className="form-label__required">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder={t("step1.emailPlaceholder")}
            className={`form-input${errors.email ? " error" : ""}`}
            autoComplete="email"
            {...register("email", {
              required: t("validation.required"),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t("validation.invalidEmail"),
              },
            })}
          />
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label" htmlFor="phone">
            {t("step1.phone")}
          </label>
          <input
            id="phone"
            type="tel"
            placeholder={t("step1.phonePlaceholder")}
            className="form-input"
            autoComplete="tel"
            {...register("phone")}
          />
        </div>

        {/* Company */}
        <div className="form-group">
          <label className="form-label" htmlFor="company_name">
            {t("step1.company")}
          </label>
          <input
            id="company_name"
            type="text"
            placeholder={t("step1.companyPlaceholder")}
            className="form-input"
            autoComplete="organization"
            {...register("company_name")}
          />
        </div>
      </div>
    </form>
  );
};

export default Step1;
