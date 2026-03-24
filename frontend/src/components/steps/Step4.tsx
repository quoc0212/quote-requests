import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Step4Data } from "../../types/form";
import Stepper from "../Stepper";

interface Props {
  defaultValues: Step4Data;
  onSubmit: (data: Step4Data) => void;
  onBack: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  currentStep: number;
}

const Step4: React.FC<Props> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitError,
  currentStep,
}) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<Step4Data>({ defaultValues });

  return (
    <form id="step4-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stepper currentStep={currentStep} />

      <div className="step4-submit-section">
        <img
          src="/icons/submit_request.svg"
          alt="Submit request"
          className="step4-submit-icon"
        />
        <h2 className="step4-submit-title">{t("step4.submitTitle")}</h2>
        <p className="step4-submit-desc">{t("step4.submitDesc")}</p>
        {submitError && (
          <div className="error-alert" role="alert">
            {submitError}
          </div>
        )}
        <button
          type="submit"
          className="btn btn--primary btn--lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span
                style={{
                  display: "inline-block",
                  width: 16,
                  height: 16,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                  marginRight: 8,
                }}
              />
              Submitting...
            </>
          ) : (
            t("step4.submit")
          )}
        </button>
      </div>
    </form>
  );
};

export default Step4;
