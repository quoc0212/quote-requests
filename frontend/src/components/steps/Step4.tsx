import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Step4Data } from '../../types/form';

interface Props {
  defaultValues: Step4Data;
  onSubmit: (data: Step4Data) => void;
  onBack: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

const Step4: React.FC<Props> = ({ defaultValues, onSubmit, onBack, isSubmitting, submitError }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step4Data>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-card__header">
        <div className="form-card__step-badge">{t('steps.step')} 4 {t('steps.of')} 5</div>
        <h2 className="form-card__title">{t('step4.title')}</h2>
        <p className="form-card__subtitle">{t('step4.subtitle')}</p>
      </div>

      <div className="form-grid form-grid--full">
        {/* Project Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="project_description">
            {t('step4.description')} <span className="form-label__required">*</span>
          </label>
          <textarea
            id="project_description"
            placeholder={t('step4.descriptionPlaceholder')}
            className={`form-textarea${errors.project_description ? ' error' : ''}`}
            rows={5}
            {...register('project_description', {
              required: t('validation.required'),
              minLength: { value: 20, message: t('validation.minLength', { min: 20 }) },
            })}
          />
          {errors.project_description && (
            <span className="form-error">{errors.project_description.message}</span>
          )}
        </div>

        {/* Additional Notes */}
        <div className="form-group">
          <label className="form-label" htmlFor="additional_notes">{t('step4.notes')}</label>
          <textarea
            id="additional_notes"
            placeholder={t('step4.notesPlaceholder')}
            className="form-textarea"
            rows={3}
            {...register('additional_notes')}
          />
        </div>
      </div>

      {submitError && (
        <div className="error-alert" role="alert">{submitError}</div>
      )}

      <div className="form-nav">
        <button type="button" className="btn btn--secondary" onClick={onBack} disabled={isSubmitting}>
          ← {t('buttons.back')}
        </button>
        <button type="submit" className="btn btn--primary btn--lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              Submitting...
            </>
          ) : (
            t('step4.submit')
          )}
        </button>
      </div>
    </form>
  );
};

export default Step4;
