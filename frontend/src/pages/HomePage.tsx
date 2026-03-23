import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Stepper from "../components/Stepper";
import Step1 from "../components/steps/Step1";
import Step2 from "../components/steps/Step2";
import Step3 from "../components/steps/Step3";
import Step4 from "../components/steps/Step4";
import Step5 from "../components/steps/Step5";
import { useTracking } from "../hooks/useTracking";
import { api } from "../services/api";
import { AllFormData } from "../types/form";

const defaultFormData: AllFormData = {
  name: "",
  email: "",
  phone: "",
  company_name: "",
  services: [],
  other_service: "",
  timeline: "",
  budget: "",
  project_description: "",
  additional_notes: "",
};

const HomePage: React.FC = () => {
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

  // Track page view on mount
  useEffect(() => {
    track("page_view", { page: "home" });
  }, [track]);

  // Track step change
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
      track("form_submit", { services: finalData.services });
      const res = await api.submitQuote({
        name: finalData.name,
        email: finalData.email,
        phone: finalData.phone || undefined,
        company_name: finalData.company_name || undefined,
        services: finalData.services,
        other_service: finalData.other_service || undefined,
        timeline: finalData.timeline || undefined,
        budget: finalData.budget || undefined,
        project_description: finalData.project_description || undefined,
        additional_notes: finalData.additional_notes || undefined,
      });
      setQuoteId(res.id);
      setEmailStatus(res.email_status as "pending");
      setFormData(finalData);
      setCurrentStep(5);
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

  return (
    <div className="app">
      <Navbar />

      {/* Form */}
      <section className="form-section" id="quote-form">
        <div className="form-wrapper">
          <Stepper currentStep={currentStep} />

          <div className="form-card">
            {currentStep === 1 && (
              <Step1
                defaultValues={{
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                  company_name: formData.company_name,
                }}
                onNext={(data) => goToNextStep(data)}
              />
            )}

            {currentStep === 2 && (
              <Step2
                defaultValues={{
                  services: formData.services,
                  other_service: formData.other_service,
                }}
                onNext={(data) => goToNextStep(data)}
                onBack={goToPrevStep}
              />
            )}

            {currentStep === 3 && (
              <Step3
                defaultValues={{
                  timeline: formData.timeline,
                  budget: formData.budget,
                }}
                onNext={(data) => goToNextStep(data)}
                onBack={goToPrevStep}
              />
            )}

            {currentStep === 4 && (
              <Step4
                defaultValues={{
                  project_description: formData.project_description,
                  additional_notes: formData.additional_notes,
                }}
                onSubmit={handleFinalSubmit}
                onBack={goToPrevStep}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            )}

            {currentStep === 5 && quoteId && (
              <Step5
                quoteId={quoteId}
                emailStatus={emailStatus}
                onStatusChange={setEmailStatus}
              />
            )}
          </div>

          {currentStep < 5 && (
            <div className="form-nav">
              {currentStep > 1 ? (
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={goToPrevStep}
                  disabled={isSubmitting}
                >
                  ← {t("buttons.back")}
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="submit"
                  form={`step${currentStep}-form`}
                  className="btn btn--primary"
                >
                  {t("buttons.next")} →
                </button>
              ) : (
                <button
                  type="submit"
                  form="step4-form"
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
                        }}
                      />
                      Submitting...
                    </>
                  ) : (
                    t("step4.submit")
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
