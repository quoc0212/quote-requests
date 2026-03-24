import { renderHook, waitFor } from '@testing-library/react';
import { useReportPage } from './useReportPage';
import { api } from '../../services/api';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'test-id' }),
}));

jest.mock('../../services/api', () => ({
  api: { getReport: jest.fn() },
}));

const mockGetReport = (api as jest.Mocked<typeof api>).getReport;

const mockReport = {
  id: 'test-id',
  name: 'Jane',
  email: 'jane@test.com',
  services: ['Development', 'Other'],
  other_service: 'AI Integration',
  email_status: 'sent',
  created_at: '2024-01-15T12:00:00Z',
};

beforeEach(() => jest.clearAllMocks());

describe('useReportPage', () => {
  it('starts with loading=true', () => {
    mockGetReport.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useReportPage());
    expect(result.current.loading).toBe(true);
    expect(result.current.report).toBeNull();
  });

  it('sets report data and loading=false on success', async () => {
    mockGetReport.mockResolvedValue(mockReport);
    const { result } = renderHook(() => useReportPage());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.report).toEqual(mockReport);
    expect(result.current.error).toBeNull();
  });

  it('sets error and loading=false on API failure', async () => {
    mockGetReport.mockRejectedValue(new Error('Not found'));
    const { result } = renderHook(() => useReportPage());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Not found');
    expect(result.current.report).toBeNull();
  });

  it('servicesList maps "Other" to include other_service detail', async () => {
    mockGetReport.mockResolvedValue(mockReport);
    const { result } = renderHook(() => useReportPage());
    await waitFor(() => expect(result.current.report).not.toBeNull());
    expect(result.current.servicesList).toContain('Other (AI Integration)');
    expect(result.current.servicesList).toContain('Development');
  });

  it('formatDate returns a non-empty string', async () => {
    mockGetReport.mockResolvedValue(mockReport);
    const { result } = renderHook(() => useReportPage());
    await waitFor(() => expect(result.current.report).not.toBeNull());
    const formatted = result.current.formatDate('2024-01-15T12:00:00Z');
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('calls api.getReport with the correct id', async () => {
    mockGetReport.mockResolvedValue(mockReport);
    renderHook(() => useReportPage());
    await waitFor(() => expect(mockGetReport).toHaveBeenCalledWith('test-id'));
  });
});
