import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { api, QuoteReport } from "../../services/api";

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [report, setReport] = useState<QuoteReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getReport(id)
      .then(setReport)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load report"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  const servicesList = report?.services.map((s) =>
    s === "Other" && report.other_service
      ? `Other (${report.other_service})`
      : s,
  );

  return (
    <div className="app">
      <Navbar />
      <div className="report-page">
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "3rem",
            }}
          >
            <div className="confirmation__spinner" />
          </div>
        )}

        {error && <div className="error-alert">{error}</div>}

        {report && (
          <>
            <div className="report-header">
              <h1> {t("report.title")}</h1>
              <Link to="/" className="btn btn--secondary">
                {t("report.back")}
              </Link>
            </div>

            {/* Contact Info */}
            <div className="report-section">
              <div className="report-section__title">
                👤 {t("report.contactInfo")}
              </div>
              <div className="report-field">
                <span className="report-field__label">{t("report.name")}</span>
                <span className="report-field__value">{report.name}</span>
              </div>
              <div className="report-field">
                <span className="report-field__label">{t("report.email")}</span>
                <span className="report-field__value">{report.email}</span>
              </div>
              {report.phone && (
                <div className="report-field">
                  <span className="report-field__label">
                    {t("report.phone")}
                  </span>
                  <span className="report-field__value">{report.phone}</span>
                </div>
              )}
              {report.company_name && (
                <div className="report-field">
                  <span className="report-field__label">
                    {t("report.company")}
                  </span>
                  <span className="report-field__value">
                    {report.company_name}
                  </span>
                </div>
              )}
            </div>

            {/* Project Details */}
            <div className="report-section">
              <div className="report-section__title">
                🚀 {t("report.projectDetails")}
              </div>
              <div className="report-field">
                <span className="report-field__label">
                  {t("report.services")}
                </span>
                <div className="services-tags">
                  {servicesList?.map((s) => (
                    <span key={s} className="service-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {report.timeline && (
                <div className="report-field">
                  <span className="report-field__label">
                    {t("report.timeline")}
                  </span>
                  <span className="report-field__value">{report.timeline}</span>
                </div>
              )}
              {report.budget && (
                <div className="report-field">
                  <span className="report-field__label">
                    {t("report.budget")}
                  </span>
                  <span className="report-field__value">{report.budget}</span>
                </div>
              )}
              {report.project_description && (
                <div className="report-field">
                  <span className="report-field__label">
                    {t("report.description")}
                  </span>
                  <span
                    className="report-field__value"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {report.project_description}
                  </span>
                </div>
              )}
              {report.additional_notes && (
                <div className="report-field">
                  <span className="report-field__label">
                    {t("report.notes")}
                  </span>
                  <span
                    className="report-field__value"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {report.additional_notes}
                  </span>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="report-section">
              <div className="report-section__title">📊 Status</div>
              <div className="report-field">
                <span className="report-field__label">
                  {t("report.submittedAt")}
                </span>
                <span className="report-field__value">
                  {formatDate(report.created_at)}
                </span>
              </div>
              <div className="report-field">
                <span className="report-field__label">
                  {t("report.emailStatus")}
                </span>
                <span
                  className={`status-badge status-badge--${report.email_status}`}
                >
                  {report.email_status === "sent"
                    ? "✅"
                    : report.email_status === "failed"
                      ? "❌"
                      : "⏳"}{" "}
                  {report.email_status}
                </span>
              </div>
              {report.email_sent_at && (
                <div className="report-field">
                  <span className="report-field__label">Sent at</span>
                  <span className="report-field__value">
                    {formatDate(report.email_sent_at)}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ReportPage;
