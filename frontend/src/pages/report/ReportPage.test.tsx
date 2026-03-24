import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ReportPage from "./ReportPage";
import { api } from "../../services/api";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("../../services/api", () => ({
  api: { getReport: jest.fn() },
}));

jest.mock("../../components/Navbar", () => () => <nav data-testid="navbar" />);
jest.mock("../../components/Footer", () => () => (
  <footer data-testid="footer" />
));

const mockGetReport = (api as jest.Mocked<typeof api>).getReport;

const mockReport = {
  id: "test-123",
  name: "John Doe",
  email: "john@test.com",
  services: ["Development"],
  email_status: "sent",
  created_at: "2024-01-01T00:00:00Z",
};

const renderPage = (id = "test-123") =>
  render(
    <MemoryRouter initialEntries={[`/report/${id}`]}>
      <Routes>
        <Route path="/report/:id" element={<ReportPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe("ReportPage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders navbar and footer", async () => {
    mockGetReport.mockResolvedValue(mockReport);
    renderPage();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("shows loading spinner while fetching", () => {
    mockGetReport.mockReturnValue(new Promise(() => {})); // never resolves
    renderPage();
    expect(
      document.querySelector(".confirmation__spinner"),
    ).toBeInTheDocument();
  });

  it("shows error message when API fails", async () => {
    mockGetReport.mockRejectedValue(new Error("Not found"));
    renderPage();
    await waitFor(() =>
      expect(screen.getByText("Not found")).toBeInTheDocument(),
    );
  });

  it("renders report name and email on success", async () => {
    mockGetReport.mockResolvedValue(mockReport);
    renderPage();
    await waitFor(() =>
      expect(screen.getByText("John Doe")).toBeInTheDocument(),
    );
    expect(screen.getByText("john@test.com")).toBeInTheDocument();
  });

  it("hides spinner after data loads", async () => {
    mockGetReport.mockResolvedValue(mockReport);
    renderPage();
    await waitFor(() =>
      expect(
        document.querySelector(".confirmation__spinner"),
      ).not.toBeInTheDocument(),
    );
  });
});
