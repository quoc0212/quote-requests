import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminLogin from "./AdminLogin";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("./useAdminLogin", () => ({ useAdminLogin: jest.fn() }));

import { useAdminLogin } from "./useAdminLogin";
const mockUseAdminLogin = useAdminLogin as jest.MockedFunction<
  typeof useAdminLogin
>;

const baseHook = {
  t: (key: string) => key,
  email: "",
  setEmail: jest.fn(),
  password: "",
  setPassword: jest.fn(),
  error: null as string | null,
  loading: false,
  handleSubmit: jest.fn(),
};

describe("AdminLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAdminLogin.mockReturnValue({ ...baseHook } as any);
  });

  it("renders email and password inputs", () => {
    render(<AdminLogin />);
    expect(screen.getByLabelText(/admin.email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/admin.password/i)).toBeInTheDocument();
  });

  it("renders login button", () => {
    render(<AdminLogin />);
    expect(
      screen.getByRole("button", { name: "admin.loginButton" }),
    ).toBeInTheDocument();
  });

  it("shows loading text when loading=true", () => {
    mockUseAdminLogin.mockReturnValue({ ...baseHook, loading: true } as any);
    render(<AdminLogin />);
    expect(
      screen.getByRole("button", { name: "admin.signingIn" }),
    ).toBeInTheDocument();
  });

  it("shows error alert when error is set", () => {
    mockUseAdminLogin.mockReturnValue({
      ...baseHook,
      error: "Invalid credentials",
    } as any);
    render(<AdminLogin />);
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials");
  });

  it("does not show error alert when error is null", () => {
    render(<AdminLogin />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("calls setEmail on email input change", () => {
    const setEmail = jest.fn();
    mockUseAdminLogin.mockReturnValue({ ...baseHook, setEmail } as any);
    render(<AdminLogin />);
    fireEvent.change(screen.getByLabelText(/admin.email/i), {
      target: { value: "a@b.com" },
    });
    expect(setEmail).toHaveBeenCalledWith("a@b.com");
  });

  it("calls setPassword on password input change", () => {
    const setPassword = jest.fn();
    mockUseAdminLogin.mockReturnValue({ ...baseHook, setPassword } as any);
    render(<AdminLogin />);
    fireEvent.change(screen.getByLabelText(/admin.password/i), {
      target: { value: "secret" },
    });
    expect(setPassword).toHaveBeenCalledWith("secret");
  });

  it("calls handleSubmit on form submission", () => {
    const handleSubmit = jest.fn((e) => e.preventDefault());
    mockUseAdminLogin.mockReturnValue({ ...baseHook, handleSubmit } as any);
    render(<AdminLogin />);
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    expect(handleSubmit).toHaveBeenCalled();
  });
});
