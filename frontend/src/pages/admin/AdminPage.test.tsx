import React from "react";
import { render, screen } from "@testing-library/react";
import AdminPage from "./AdminPage";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("./login/AdminLogin", () => () => <div data-testid="admin-login" />);
jest.mock("./dashboard/AdminDashboard", () => () => (
  <div data-testid="admin-dashboard" />
));
jest.mock("./useAdminPage", () => ({ useAdminPage: jest.fn() }));

import { useAdminPage } from "./useAdminPage";
const mockUseAdminPage = useAdminPage as jest.MockedFunction<
  typeof useAdminPage
>;

describe("AdminPage", () => {
  it("renders AdminLogin when not authenticated", () => {
    mockUseAdminPage.mockReturnValue({ isAuthenticated: false });
    render(<AdminPage />);
    expect(screen.getByTestId("admin-login")).toBeInTheDocument();
    expect(screen.queryByTestId("admin-dashboard")).not.toBeInTheDocument();
  });

  it("renders AdminDashboard when authenticated", () => {
    mockUseAdminPage.mockReturnValue({ isAuthenticated: true });
    render(<AdminPage />);
    expect(screen.getByTestId("admin-dashboard")).toBeInTheDocument();
    expect(screen.queryByTestId("admin-login")).not.toBeInTheDocument();
  });
});
