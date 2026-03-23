export interface QuoteRequest {
  id: string;
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
  // Status
  email_status: 'pending' | 'sending' | 'sent' | 'failed';
  email_sent_at?: string;
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface TrackingEvent {
  id: string;
  session_id: string;
  event_type: string;
  event_data?: Record<string, unknown>;
  page?: string;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
}

export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface JwtPayload {
  adminId: string;
  email: string;
}
