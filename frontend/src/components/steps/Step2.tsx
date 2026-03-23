import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Step2Data, SERVICES } from "../../types/form";

const SERVICE_ICONS: Record<string, string> = {
  Development: "💻",
  "Web Design": "🎨",
  Marketing: "📢",
  SEO: "🔍",
  Consulting: "💼",
  Other: "✨",
};

interface Props {
  defaultValues: Step2Data;
  onNext: (data: Step2Data) => void;
  onBack: () => void;
}

const Step2: React.FC<Props> = ({ defaultValues, onNext, onBack }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,

    formState: { errors },
    setError,
    clearErrors,
  } = useForm<Step2Data>({ defaultValues, mode: "onChange" });

  const selectedServices = watch("services") || [];
  const showOther = selectedServices.includes("Other");

  const onSubmit = (data: Step2Data) => {
    if (!data.services || data.services.length === 0) {
      setError("services", { message: t("step2.atLeastOne") });
      return;
    }
    clearErrors("services");
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-card__header">
        <div className="form-card__step-badge">
          {t("steps.step")} 2 {t("steps.of")} 5
        </div>
        <h2 className="form-card__title">{t("step2.title")}</h2>
        <p className="form-card__subtitle">{t("step2.subtitle")}</p>
      </div>

      <div
        className="services-grid"
        role="group"
        aria-labelledby="services-label"
      >
        {SERVICES.map((service) => (
          <div className="service-card" key={service}>
            <input
              type="checkbox"
              id={`service-${service}`}
              value={service}
              className="service-card__input"
              {...register("services", {
                validate: (v) => (v && v.length > 0) || t("step2.atLeastOne"),
              })}
            />
            <label
              htmlFor={`service-${service}`}
              className="service-card__label"
            >
              <span className="service-card__icon">
                {SERVICE_ICONS[service]}
              </span>
              <span className="service-card__name">
                {t(`step2.services.${service}`)}
              </span>
              <span className="service-card__check">
                {selectedServices.includes(service) ? "✓" : ""}
              </span>
            </label>
          </div>
        ))}
      </div>

      {errors.services && (
        <div className="form-error mb-2">{errors.services.message}</div>
      )}

      {/* Other service text field - appears dynamically */}
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

      <div className="form-nav">
        <button type="button" className="btn btn--secondary" onClick={onBack}>
          ← {t("buttons.back")}
        </button>
        <button type="submit" className="btn btn--primary">
          {t("buttons.next")} →
        </button>
      </div>
    </form>
  );
};

export default Step2;
