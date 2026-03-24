import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTracking } from "../../hooks/useTracking";
import { api } from "../../services/api";
import { AllFormData } from "../../types/form";

const defaultFormData: AllFormData = {
  name: "",
  email: "",
  phone: "",
  company_name: "",
  service: "",
  other_service: "",
  timeline: "",
  budget: "",
  project_description: "",
  additional_notes: "",
};

export function useHomePage() {
  const { t } = useTranslation();
  const { track } = useTracking();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AllFormData>(defaultFormData);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<
    "pending" | "sending" | "sent" | "failed"
  >("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    track("page_view", { page: "home" });
  }, [track]);

  useEffect(() => {
    if (currentStep > 1) {
      track("step_view", { step: currentStep });
    }
  }, [currentStep, track]);

  const goToNextStep = (stepData: Partial<AllFormData>) => {
    const updated = { ...formData, ...stepData };
    setFormData(updated);
    track("step_completed", { from_step: currentStep });
    setCurrentStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPrevStep = () => {
    track("step_back", { from_step: currentStep });
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = async (step4Data: {
    project_description: string;
    additional_notes: string;
  }) => {
    const finalData = { ...formData, ...step4Data };
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      track("form_submit", { service: finalData.service });
      const res = await api.submitQuote({
        name: finalData.name,
        email: finalData.email,
        phone: finalData.phone || undefined,
        company_name: finalData.company_name || undefined,
        services: finalData.service ? [finalData.service] : [],
        other_service: finalData.other_service || undefined,
        timeline: finalData.timeline || undefined,
        budget: finalData.budget || undefined,
        project_description: finalData.project_description || undefined,
        additional_notes: finalData.additional_notes || undefined,
      });
      setQuoteId(res.id);
      setEmailStatus(res.email_status as "pending");
      setFormData(finalData);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again.";
      setSubmitError(msg);
      track("form_submit_error", { error: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    t,
    currentStep,
    formData,
    quoteId,
    emailStatus,
    setEmailStatus,
    isSubmitting,
    submitError,
    goToNextStep,
    goToPrevStep,
    handleFinalSubmit,
  };
}
