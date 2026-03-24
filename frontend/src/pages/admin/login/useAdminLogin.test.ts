import { renderHook, act, waitFor } from '@testing-library/react';
import { useAdminLogin } from './useAdminLogin';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockLogin = jest.fn();
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

jest.mock('../../../services/api', () => ({
  api: { login: jest.fn() },
}));

import { api } from '../../../services/api';
const mockApiLogin = api.login as jest.MockedFunction<typeof api.login>;

beforeEach(() => jest.clearAllMocks());

describe('useAdminLogin', () => {
  it('initializes with empty fields and no error', () => {
    const { result } = renderHook(() => useAdminLogin());
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('setEmail and setPassword update state', () => {
    const { result } = renderHook(() => useAdminLogin());
    act(() => result.current.setEmail('admin@x.com'));
    act(() => result.current.setPassword('pass123'));
    expect(result.current.email).toBe('admin@x.com');
    expect(result.current.password).toBe('pass123');
  });

  it('calls api.login and context login on successful submit', async () => {
    mockApiLogin.mockResolvedValue({ token: 'tok', email: 'admin@x.com' });
    const { result } = renderHook(() => useAdminLogin());
    act(() => result.current.setEmail('admin@x.com'));
    act(() => result.current.setPassword('pass'));

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });

    expect(mockApiLogin).toHaveBeenCalledWith('admin@x.com', 'pass');
    expect(mockLogin).toHaveBeenCalledWith('tok', 'admin@x.com');
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('sets error when api.login throws', async () => {
    mockApiLogin.mockRejectedValue(new Error('Invalid credentials'));
    const { result } = renderHook(() => useAdminLogin());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });

    expect(result.current.error).toBe('Invalid credentials');
    expect(mockLogin).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('sets loading=true during submission then false after', async () => {
    let resolveLogin!: (v: { token: string; email: string }) => void;
    mockApiLogin.mockReturnValue(new Promise((r) => { resolveLogin = r; }));
    const { result } = renderHook(() => useAdminLogin());

    act(() => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });
    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveLogin({ token: 'tok', email: 'a@b.com' });
    });
    expect(result.current.loading).toBe(false);
  });
});
