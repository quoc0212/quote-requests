const API_URL = process.env.REACT_APP_API_URL || '/api';

export interface QuoteFormData {
  // Step 1
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  // Step 2
  services: string[];
  other_service?: string;
  // Step 3
  timeline?: string;
  budget?: string;
  // Step 4
  project_description?: string;
  additional_notes?: string;
}

export interface QuoteSubmitResponse {
  id: string;
  email_status: string;
}

export interface EmailStatusResponse {
  id: string;
  email_status: 'pending' | 'sending' | 'sent' | 'failed';
  email_sent_at?: string;
}

export interface QuoteReport {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  services: string[];
  other_service?: string;
  timeline?: string;
  budget?: string;
  project_description?: string;
  additional_notes?: string;
  email_status: string;
  email_sent_at?: string;
  created_at: string;
}

export interface AdminQuotesResponse {
  data: QuoteReport[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface AdminStats {
  total: number;
  by_service: { service: string; count: string }[];
  by_status: { email_status: string; count: string }[];
  recent_30_days: { date: string; count: string }[];
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    const message = data?.errors?.[0]?.msg || data?.error || 'Request failed';
    throw new Error(message);
  }
  return data as T;
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export const api = {
  // Public
  submitQuote(data: QuoteFormData): Promise<QuoteSubmitResponse> {
    return request<QuoteSubmitResponse>('/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getEmailStatus(id: string): Promise<EmailStatusResponse> {
    return request<EmailStatusResponse>(`/quotes/${id}/email-status`);
  },

  retryEmail(id: string): Promise<{ message: string; email_status: string }> {
    return request(`/quotes/${id}/retry-email`, { method: 'POST' });
  },

  getReport(id: string): Promise<QuoteReport> {
    return request<QuoteReport>(`/quotes/${id}/report`);
  },

  trackEvent(payload: {
    session_id: string;
    event_type: string;
    event_data?: Record<string, unknown>;
    page?: string;
  }): Promise<void> {
    return request('/tracking', { method: 'POST', body: JSON.stringify(payload) });
  },

  // Auth
  login(email: string, password: string): Promise<{ token: string; email: string }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Admin
  adminGetQuotes(
    token: string,
    params: {
      search?: string; service?: string;
      start_date?: string; end_date?: string;
      page?: number; limit?: number;
    } = {}
  ): Promise<AdminQuotesResponse> {
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    if (params.service) qs.set('service', params.service);
    if (params.start_date) qs.set('start_date', params.start_date);
    if (params.end_date) qs.set('end_date', params.end_date);
    if (params.page) qs.set('page', String(params.page));
    if (params.limit) qs.set('limit', String(params.limit));
    return request<AdminQuotesResponse>(`/admin/quotes?${qs.toString()}`, {
      headers: authHeaders(token),
    });
  },

  adminGetStats(token: string): Promise<AdminStats> {
    return request<AdminStats>('/admin/stats', { headers: authHeaders(token) });
  },

  adminGetQuote(token: string, id: string): Promise<QuoteReport> {
    return request<QuoteReport>(`/admin/quotes/${id}`, { headers: authHeaders(token) });
  },
};
