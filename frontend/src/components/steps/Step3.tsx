import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Step3Data, TIMELINE_OPTIONS, BUDGET_OPTIONS } from '../../types/form';

interface Props {
  defaultValues: Step3Data;
  onNext: (data: Step3Data) => void;
  onBack: () => void;
}

const Step3: React.FC<Props> = ({ defaultValues, onNext, onBack }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3Data>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <div className="form-card__header">
        <div className="form-card__step-badge">{t('steps.step')} 3 {t('steps.of')} 5</div>
        <h2 className="form-card__title">{t('step3.title')}</h2>
        <p className="form-card__subtitle">{t('step3.subtitle')}</p>
      </div>

      <div className="form-grid form-grid--full">
        {/* Timeline */}
        <div className="form-group">
          <label className="form-label" htmlFor="timeline">
            {t('step3.timeline')} <span className="form-label__required">*</span>
          </label>
          <select
            id="timeline"
            className={`form-select${errors.timeline ? ' error' : ''}`}
            {...register('timeline', { required: t('validation.required') })}
          >
            {TIMELINE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>
                {t(`step3.timelineOptions.${opt}`) || opt}
              </option>
            ))}
          </select>
          {errors.timeline && <span className="form-error">{errors.timeline.message}</span>}
        </div>

        {/* Budget */}
        <div className="form-group">
          <label className="form-label" htmlFor="budget">
            {t('step3.budget')} <span className="form-label__required">*</span>
          </label>
          <select
            id="budget"
            className={`form-select${errors.budget ? ' error' : ''}`}
            {...register('budget', { required: t('validation.required') })}
          >
            {BUDGET_OPTIONS.map(opt => (
              <option key={opt} value={opt}>
                {t(`step3.budgetOptions.${opt}`) || opt}
              </option>
            ))}
          </select>
          {errors.budget && <span className="form-error">{errors.budget.message}</span>}
        </div>
      </div>

      <div className="form-nav">
        <button type="button" className="btn btn--secondary" onClick={onBack}>
          ← {t('buttons.back')}
        </button>
        <button type="submit" className="btn btn--primary">
          {t('buttons.next')} →
        </button>
      </div>
    </form>
  );
};

export default Step3;
