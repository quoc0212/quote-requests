import React, { useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

interface Props {
  quoteId: string;
  emailStatus: "pending" | "sending" | "sent" | "failed";
  onStatusChange: (status: "pending" | "sending" | "sent" | "failed") => void;
}

const POLL_INTERVAL = 3000; // 3 seconds
const MAX_POLLS = 20; // Stop polling after 1 minute

const Step5: React.FC<Props> = ({ quoteId, emailStatus, onStatusChange }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pollCount = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const poll = useCallback(async () => {
    if (pollCount.current >= MAX_POLLS) {
      onStatusChange("failed");
      return;
    }
    pollCount.current++;
    try {
      const res = await api.getEmailStatus(quoteId);
      onStatusChange(res.email_status);
      if (res.email_status === "sent" || res.email_status === "failed") {
        return; // Stop polling
      }
      timerRef.current = setTimeout(poll, POLL_INTERVAL);
    } catch {
      timerRef.current = setTimeout(poll, POLL_INTERVAL);
    }
  }, [quoteId, onStatusChange]);

  useEffect(() => {
    if (emailStatus !== "sent" && emailStatus !== "failed") {
      timerRef.current = setTimeout(poll, POLL_INTERVAL);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [poll, emailStatus]);

  const handleRetry = async () => {
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
            <p className="confirmation__message">{t("step5.checkingStatus")}</p>
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
                📋 {t("step5.viewReport")}
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
            <p className="confirmation__message">{t("step5.failedMessage")}</p>
            <div className="confirmation__actions">
              <button className="btn btn--danger" onClick={handleRetry}>
                🔄 {t("step5.retry")}
              </button>
              <button className="btn btn--outline" onClick={handleViewReport}>
                📋 {t("step5.viewReport")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Step5;
