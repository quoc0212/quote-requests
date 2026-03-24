import React from "react";
import { Step4Data } from "../../types/form";
import Stepper from "../Stepper";
import { useStepForm } from "./useStepForm";

interface Props {
  defaultValues: Step4Data;
  onSubmit: (data: Step4Data) => void;
  onBack: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  currentStep: number;
  quoteId: string | null;
  emailStatus: "pending" | "sending" | "sent" | "failed";
  onStatusChange: (status: "pending" | "sending" | "sent" | "failed") => void;
}

const Step4: React.FC<Props> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitError,
  currentStep,
  quoteId,
  emailStatus,
  onStatusChange,
}) => {
  const {
    t,
    onSubmit: formSubmit,
    handleRetry,
    handleViewReport,
    isPending,
    isSent,
    isFailed,
  } = useStepForm({
    step: 4,
    defaultValues,
    onSubmit,
    quoteId,
    emailStatus,
    onStatusChange,
  });

  // Post-submit: show email status UI
  if (quoteId) {
    return (
      <div>
        {!isSent && (
          <div className="form-card__header" style={{ textAlign: "center" }}>
            <h2 className="form-card__title">{t("step5.title")}</h2>
          </div>
        )}
        <div className="confirmation">
          {isPending && (
            <>
              <div
                className="confirmation__spinner"
                role="status"
                aria-label="Loading"
              />
              <h3 className="confirmation__title">{t("step5.sending")}</h3>
              <p className="confirmation__message">
                {t("step5.checkingStatus")}
              </p>
            </>
          )}

          {isSent && (
            <>
              <div
                className="confirmation__icon confirmation__icon--sent"
                role="img"
                aria-label="Success"
              >
                ✅
              </div>
              <h3 className="confirmation__title">{t("step5.sent")}</h3>
              <p className="confirmation__message">{t("step5.sentMessage")}</p>
              <div className="confirmation__actions">
                <button
                  className="btn btn--primary btn--lg"
                  onClick={handleViewReport}
                >
                  {t("step5.viewReport")}
                </button>
              </div>
            </>
          )}

          {isFailed && (
            <>
              <div
                className="confirmation__icon confirmation__icon--failed"
                role="img"
                aria-label="Failed"
              >
                ❌
              </div>
              <h3 className="confirmation__title">{t("step5.failed")}</h3>
              <p className="confirmation__message">
                {t("step5.failedMessage")}
              </p>
              <div className="confirmation__actions">
                <button className="btn btn--danger" onClick={handleRetry}>
                  {t("step5.retry")}
                </button>
                <button className="btn btn--outline" onClick={handleViewReport}>
                  {t("step5.viewReport")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <form id="step4-form" onSubmit={formSubmit} noValidate>
      <Stepper currentStep={currentStep} />
      <hr className="stepper-divider" />

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
