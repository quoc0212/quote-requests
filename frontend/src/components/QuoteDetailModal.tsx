import React from 'react';
import { useTranslation } from 'react-i18next';
import { QuoteReport } from '../services/api';

interface Props {
  quote: QuoteReport;
  onClose: () => void;
}

const QuoteDetailModal: React.FC<Props> = ({ quote, onClose }) => {
  const { t } = useTranslation();

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const servicesList = quote.services.map(s =>
    s === 'Other' && quote.other_service ? `Other (${quote.other_service})` : s
  );

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title" id="modal-title">{t('admin.detailTitle')}</h2>
          <button className="modal__close" onClick={onClose} aria-label={t('admin.close')}>✕</button>
        </div>
        <div className="modal__body">
          {/* Contact */}
          <div className="report-section" style={{ marginBottom: '1rem' }}>
            <div className="report-section__title">👤 {t('report.contactInfo')}</div>
            <div className="report-field">
              <span className="report-field__label">{t('report.name')}</span>
              <span className="report-field__value">{quote.name}</span>
            </div>
            <div className="report-field">
              <span className="report-field__label">{t('report.email')}</span>
              <span className="report-field__value">{quote.email}</span>
            </div>
            {quote.phone && (
              <div className="report-field">
                <span className="report-field__label">{t('report.phone')}</span>
                <span className="report-field__value">{quote.phone}</span>
              </div>
            )}
            {quote.company_name && (
              <div className="report-field">
                <span className="report-field__label">{t('report.company')}</span>
                <span className="report-field__value">{quote.company_name}</span>
              </div>
            )}
          </div>

          {/* Services */}
          <div className="report-section" style={{ marginBottom: '1rem' }}>
            <div className="report-section__title">🚀 {t('report.projectDetails')}</div>
            <div className="report-field">
              <span className="report-field__label">{t('report.services')}</span>
              <div className="services-tags">
                {servicesList.map(s => <span key={s} className="service-tag">{s}</span>)}
              </div>
            </div>
            {quote.timeline && (
              <div className="report-field">
                <span className="report-field__label">{t('report.timeline')}</span>
                <span className="report-field__value">{quote.timeline}</span>
              </div>
            )}
            {quote.budget && (
              <div className="report-field">
                <span className="report-field__label">{t('report.budget')}</span>
                <span className="report-field__value">{quote.budget}</span>
              </div>
            )}
            {quote.project_description && (
              <div className="report-field">
                <span className="report-field__label">{t('report.description')}</span>
                <span className="report-field__value" style={{ whiteSpace: 'pre-wrap' }}>{quote.project_description}</span>
              </div>
            )}
            {quote.additional_notes && (
              <div className="report-field">
                <span className="report-field__label">{t('report.notes')}</span>
                <span className="report-field__value" style={{ whiteSpace: 'pre-wrap' }}>{quote.additional_notes}</span>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="report-section">
            <div className="report-section__title">📊 Status</div>
            <div className="report-field">
              <span className="report-field__label">{t('report.submittedAt')}</span>
              <span className="report-field__value">{formatDate(quote.created_at)}</span>
            </div>
            <div className="report-field">
              <span className="report-field__label">{t('report.emailStatus')}</span>
              <span className={`status-badge status-badge--${quote.email_status}`}>
                {quote.email_status === 'sent' ? '✅' : quote.email_status === 'failed' ? '❌' : '⏳'} {quote.email_status}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
            <button className="btn btn--secondary" onClick={onClose}>{t('admin.close')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetailModal;
