import { useCallback, useRef } from 'react';
import { api } from '../services/api';

function getOrCreateSessionId(): string {
  const key = 'quote_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function useTracking() {
  const sessionId = useRef(getOrCreateSessionId());

  const track = useCallback(
    (
      eventType: string,
      eventData?: Record<string, unknown>,
      page?: string
    ) => {
      // Fire-and-forget – do not block UI on tracking
      api
        .trackEvent({
          session_id: sessionId.current,
          event_type: eventType,
          event_data: eventData,
          page: page || window.location.pathname,
        })
        .catch(() => {
          // Silently ignore tracking failures
        });
    },
    []
  );

  return { track };
}
