import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Stepper from '../components/Stepper';
import Step1 from '../components/steps/Step1';
import Step2 from '../components/steps/Step2';
import Step3 from '../components/steps/Step3';
import Step4 from '../components/steps/Step4';
import Step5 from '../components/steps/Step5';
import { useTracking } from '../hooks/useTracking';
import { api } from '../services/api';
import { AllFormData } from '../types/form';

const TOTAL_STEPS = 5;

const defaultFormData: AllFormData = {
  name: '',
  email: '',
  phone: '',
  company_name: '',
  services: [],
  other_service: '',
  timeline: '',
  budget: '',
  project_description: '',
  additional_notes: '',
};

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { track } = useTracking();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AllFormData>(defaultFormData);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<'pending' | 'sending' | 'sent' | 'failed'>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Track page view on mount
  useEffect(() => {
    track('page_view', { page: 'home' });
  }, [track]);

  // Track step change
  useEffect(() => {
    if (currentStep > 1) {
      track('step_view', { step: currentStep });
    }
  }, [currentStep, track]);

  const handleHeroCtaClick = () => {
    track('cta_click', { button: 'hero_get_started' });
    document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToNextStep = (stepData: Partial<AllFormData>) => {
    const updated = { ...formData, ...stepData };
    setFormData(updated);
    track('step_completed', { from_step: currentStep });
    setCurrentStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevStep = () => {
    track('step_back', { from_step: currentStep });
    setCurrentStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async (step4Data: { project_description: string; additional_notes: string }) => {
    const finalData = { ...formData, ...step4Data };
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      track('form_submit', { services: finalData.services });
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
      setEmailStatus(res.email_status as 'pending');
      setFormData(finalData);
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setSubmitError(msg);
      track('form_submit_error', { error: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__badge">🚀 {t('hero.badge')}</div>
          <h1 className="hero__title">
            {t('hero.title')} <br />
            <span className="hero__title-highlight">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="hero__subtitle">{t('hero.subtitle')}</p>
          <button className="hero__cta" onClick={handleHeroCtaClick}>
            {t('hero.cta')} →
          </button>
        </div>
      </section>

      {/* Form */}
      <section className="form-section" id="quote-form">
        <div className="form-wrapper">
          <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          <div className="form-card">
            {currentStep === 1 && (
              <Step1
                defaultValues={{ name: formData.name, email: formData.email, phone: formData.phone, company_name: formData.company_name }}
                onNext={data => goToNextStep(data)}
              />
            )}

            {currentStep === 2 && (
              <Step2
                defaultValues={{ services: formData.services, other_service: formData.other_service }}
                onNext={data => goToNextStep(data)}
                onBack={goToPrevStep}
              />
            )}

            {currentStep === 3 && (
              <Step3
                defaultValues={{ timeline: formData.timeline, budget: formData.budget }}
                onNext={data => goToNextStep(data)}
                onBack={goToPrevStep}
              />
            )}

            {currentStep === 4 && (
              <Step4
                defaultValues={{ project_description: formData.project_description, additional_notes: formData.additional_notes }}
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
        </div>
      </section>
    </div>
  );
};

export default HomePage;
