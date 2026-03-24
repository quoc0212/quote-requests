export interface Step1Data {
  name: string;
  email: string;
  phone: string;
  company_name: string;
}

export interface Step2Data {
  service: string;
  other_service: string;
}

export interface Step3Data {
  timeline: string;
  budget: string;
}

export interface Step4Data {
  project_description: string;
  additional_notes: string;
}

export type AllFormData = Step1Data & Step2Data & Step3Data & Step4Data;

export const SERVICES = [
  'Development',
  'Web Design',
  'Marketing',
  'SEO',
  'Consulting',
  'Other',
] as const;

export type Service = typeof SERVICES[number];

export const TIMELINE_OPTIONS = [
  '',
  'Less than 1 month',
  '1-3 months',
  '3-6 months',
  '6-12 months',
  'More than 1 year',
] as const;

export const BUDGET_OPTIONS = [
  '$5,000 - $10,000',
  '$10,000 - $20,000',
  '$20,000 - $50,000',
  '$50,000+',
] as const;
