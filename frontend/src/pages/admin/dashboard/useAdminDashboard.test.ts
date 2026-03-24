import { renderHook, act, waitFor } from '@testing-library/react';
import { useAdminDashboard } from './useAdminDashboard';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en', changeLanguage: jest.fn() } }),
}));

const mockLogout = jest.fn();
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({ token: 'mock-token', adminEmail: 'admin@test.com', logout: mockLogout }),
}));

jest.mock('../../../services/api', () => ({
  api: {
    adminGetQuotes: jest.fn(),
    adminGetStats: jest.fn(),
  },
}));

import { api } from '../../../services/api';
const mockGetQuotes = api.adminGetQuotes as jest.MockedFunction<typeof api.adminGetQuotes>;
const mockGetStats = api.adminGetStats as jest.MockedFunction<typeof api.adminGetStats>;

const mockQuotesResponse = {
  data: [{ id: '1', name: 'Alice', email: 'a@a.com', services: ['SEO'], email_status: 'sent', created_at: '2024-01-01T00:00:00Z' }],
  pagination: { total: 1, page: 1, limit: 15, total_pages: 1 },
};

const mockStatsResponse = {
  total: 10,
  by_service: [{ service: 'Development', count: '5' }, { service: 'SEO', count: '3' }],
  by_status: [{ email_status: 'sent', count: '8' }],
  recent_30_days: [{ date: '2024-01-01', count: '2' }],
};

beforeEach(() => {
  jest.clearAllMocks();
  mockGetQuotes.mockResolvedValue(mockQuotesResponse);
  mockGetStats.mockResolvedValue(mockStatsResponse);
});

describe('useAdminDashboard', () => {
  it('fetches quotes and stats on mount', async () => {
    const { result } = renderHook(() => useAdminDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockGetQuotes).toHaveBeenCalledTimes(1);
    expect(mockGetStats).toHaveBeenCalledTimes(1);
    expect(result.current.quotes).toHaveLength(1);
  });

  it('derives sentCount from stats', async () => {
    const { result } = renderHook(() => useAdminDashboard());
    await waitFor(() => expect(result.current.stats).not.toBeNull());
    expect(result.current.sentCount).toBe('8');
  });

  it('derives topService from stats', async () => {
    const { result } = renderHook(() => useAdminDashboard());
    await waitFor(() => expect(result.current.stats).not.toBeNull());
    expect(result.current.topService).toBe('Development');
  });

  it('hasActiveFilters is false by default', async () => {
    const { result } = renderHook(() => useAdminDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('hasActiveFilters is true when search is set', async () => {
    const { result } = renderHook(() => useAdminDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.setSearch('test'));
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('clearFilters resets all filter fields', async () => {
    const { result } = renderHook(() => useAdminDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => {
      result.current.setSearch('query');
      result.current.setServiceFilter('SEO');
    });
    act(() => result.current.clearFilters());
    expect(result.current.search).toBe('');
    expect(result.current.serviceFilter).toBe('');
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('setActiveTab switches the active tab', async () => {
    const { result } = renderHook(() => useAdminDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.setActiveTab('stats'));
    expect(result.current.activeTab).toBe('stats');
  });

  it('formatDate converts ISO string to locale string', async () => {
    const { result } = renderHook(() => useAdminDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const formatted = result.current.formatDate('2024-01-15T00:00:00Z');
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('handleSearch calls fetchQuotes', async () => {
    const { result } = renderHook(() => useAdminDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));
    mockGetQuotes.mockClear();
    await act(async () => {
      result.current.handleSearch({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });
    await waitFor(() => expect(mockGetQuotes).toHaveBeenCalled());
  });
});
