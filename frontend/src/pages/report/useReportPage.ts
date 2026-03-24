import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api, QuoteReport } from "../../services/api";

export function useReportPage() {
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

  return { t, report, loading, error, formatDate, servicesList };
}
