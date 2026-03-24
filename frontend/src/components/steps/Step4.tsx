import React, { useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Step4Data } from "../../types/form";
import Stepper from "../Stepper";
import { api } from "../../services/api";

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

const POLL_INTERVAL = 3000;
const MAX_POLLS = 20;

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { handleSubmit } = useForm<Step4Data>({ defaultValues });
  const pollCount = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const poll = useCallback(async () => {
    if (!quoteId || pollCount.current >= MAX_POLLS) {
      onStatusChange("failed");
      return;
    }
    pollCount.current++;
    try {
      const res = await api.getEmailStatus(quoteId);
      onStatusChange(res.email_status);
      if (res.email_status === "sent" || res.email_status === "failed") return;
      timerRef.current = setTimeout(poll, POLL_INTERVAL);
    } catch {
      timerRef.current = setTimeout(poll, POLL_INTERVAL);
    }
  }, [quoteId, onStatusChange]);

  useEffect(() => {
    if (quoteId && emailStatus !== "sent" && emailStatus !== "failed") {
      timerRef.current = setTimeout(poll, POLL_INTERVAL);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [poll, quoteId, emailStatus]);

  const handleRetry = async () => {
    if (!quoteId) return;
    pollCount.current = 0;
    onStatusChange("pending");
    try {
      await api.retryEmail(quoteId);
      timerRef.current = setTimeout(poll, POLL_INTERVAL);
    } catch {
      onStatusChange("failed");
    }
  };

  const handleViewReport = () => {
    navigate(`/report/${quoteId}`);
  };

  // Post-submit: show email status UI
  if (quoteId) {
    const isPending = emailStatus === "pending" || emailStatus === "sending";
    const isSent = emailStatus === "sent";
    const isFailed = emailStatus === "failed";

    return (
      <div>
        <div className="form-card__header">
          <h2 className="form-card__title">{t("step5.title")}</h2>
        </div>
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

  // Pre-submit: show the submit form
  return (
    <form id="step4-form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
