import { renderHook, act, waitFor } from '@testing-library/react';
import { useHomePage } from './useHomePage';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../hooks/useTracking', () => ({
  useTracking: () => ({ track: jest.fn() }),
}));

jest.mock('../../services/api', () => ({
  api: {
    submitQuote: jest.fn(),
    trackEvent: jest.fn().mockResolvedValue({}),
  },
}));

import { api } from '../../services/api';
const mockSubmitQuote = api.submitQuote as jest.MockedFunction<typeof api.submitQuote>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useHomePage', () => {
  it('initializes at step 1 with empty form data and null quoteId', () => {
    const { result } = renderHook(() => useHomePage());
    expect(result.current.currentStep).toBe(1);
    expect(result.current.quoteId).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitError).toBeNull();
  });

  it('goToNextStep increments step and merges form data', () => {
    const { result } = renderHook(() => useHomePage());
    act(() => {
      result.current.goToNextStep({ name: 'Alice', email: 'a@a.com', phone: '', company_name: '' });
    });
    expect(result.current.currentStep).toBe(2);
    expect(result.current.formData.name).toBe('Alice');
    expect(result.current.formData.email).toBe('a@a.com');
  });

  it('goToPrevStep decrements the current step', () => {
    const { result } = renderHook(() => useHomePage());
    act(() => {
      result.current.goToNextStep({ name: 'Bob', email: 'b@b.com', phone: '', company_name: '' });
    });
    act(() => {
      result.current.goToPrevStep();
    });
    expect(result.current.currentStep).toBe(1);
  });

  it('handleFinalSubmit calls api.submitQuote and sets quoteId on success', async () => {
    mockSubmitQuote.mockResolvedValue({ id: 'quote-1', email_status: 'pending' });
    const { result } = renderHook(() => useHomePage());

    await act(async () => {
      await result.current.handleFinalSubmit({ project_description: 'desc', additional_notes: '' });
    });

    expect(mockSubmitQuote).toHaveBeenCalled();
    expect(result.current.quoteId).toBe('quote-1');
    expect(result.current.submitError).toBeNull();
  });

  it('handleFinalSubmit sets submitError on API failure', async () => {
    mockSubmitQuote.mockRejectedValue(new Error('Server error'));
    const { result } = renderHook(() => useHomePage());

    await act(async () => {
      await result.current.handleFinalSubmit({ project_description: 'x', additional_notes: '' });
    });

    expect(result.current.submitError).toBe('Server error');
    expect(result.current.quoteId).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('goToNextStep accumulates data across multiple steps', () => {
    const { result } = renderHook(() => useHomePage());
    act(() => {
      result.current.goToNextStep({ name: 'Carol', email: 'c@c.com', phone: '', company_name: '' });
    });
    act(() => {
      result.current.goToNextStep({ service: 'Development', other_service: '' });
    });
    expect(result.current.formData.name).toBe('Carol');
    expect(result.current.formData.service).toBe('Development');
  });
});
