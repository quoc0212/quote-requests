import { useEffect, useCallback, useRef } from "react";
import { useForm, FieldValues, DefaultValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export type EmailStatus = "pending" | "sending" | "sent" | "failed";

export const SERVICE_OPTIONS = [
  { value: "Development", icon: "/icons/development_icon.svg" },
  { value: "Web Design", icon: "/icons/web_design_icon.svg" },
  { value: "Marketing", icon: "/icons/marketing_icon.svg" },
  { value: "Other", icon: "/icons/other_icon.svg" },
] as const;

const POLL_INTERVAL = 3000;
const MAX_POLLS = 20;

interface StepFormConfig<T extends FieldValues> {
  step: 1 | 2 | 3 | 4;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => void;
  // Step 4 only
  quoteId?: string | null;
  emailStatus?: EmailStatus;
  onStatusChange?: (status: EmailStatus) => void;
}

export function useStepForm<T extends FieldValues>({
  step,
  defaultValues,
  onSubmit,
  quoteId = null,
  emailStatus = "pending",
  onStatusChange,
}: StepFormConfig<T>) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<T>({
    defaultValues,
    mode: step === 1 ? "onBlur" : step === 2 ? "onChange" : "onSubmit",
  });

  // Step 2: watch selected service
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedService: string = watch("service" as any) ?? "";
  const showOther = selectedService === "Other";

  // Step 3: watch selected budget
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedBudget: string = watch("budget" as any) ?? "";

  // Step 4: email polling
  const pollCount = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const poll = useCallback(async () => {
    if (!quoteId || pollCount.current >= MAX_POLLS) {
      onStatusChange?.("failed");
      return;
    }
    pollCount.current++;
    try {
      const res = await api.getEmailStatus(quoteId);
      onStatusChange?.(res.email_status);
      if (res.email_status === "sent" || res.email_status === "failed") return;
      timerRef.current = setTimeout(poll, POLL_INTERVAL);
    } catch {
      timerRef.current = setTimeout(poll, POLL_INTERVAL);
    }
  }, [quoteId, onStatusChange]);

  useEffect(() => {
    if (step !== 4) return;
    if (quoteId && emailStatus !== "sent" && emailStatus !== "failed") {
      timerRef.current = setTimeout(poll, POLL_INTERVAL);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [step, poll, quoteId, emailStatus]);

  const handleRetry = async () => {
    if (!quoteId) return;
    pollCount.current = 0;
    onStatusChange?.("pending");
    try {
      await api.retryEmail(quoteId);
      timerRef.current = setTimeout(poll, POLL_INTERVAL);
    } catch {
      onStatusChange?.("failed");
    }
  };

  const handleViewReport = () => navigate(`/report/${quoteId}`);

  const isPending = emailStatus === "pending" || emailStatus === "sending";
  const isSent = emailStatus === "sent";
  const isFailed = emailStatus === "failed";

  return {
    t,
    register,
    onSubmit: handleSubmit(onSubmit),
    errors,
    // Step 2
    selectedService,
    showOther,
    // Step 3
    selectedBudget,
    // Step 4
    handleRetry,
    handleViewReport,
    isPending,
    isSent,
    isFailed,
  };
}
