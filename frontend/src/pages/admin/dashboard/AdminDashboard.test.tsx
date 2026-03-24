import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminDashboard from "./AdminDashboard";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("./useAdminDashboard", () => ({
  useAdminDashboard: jest.fn(),
  SERVICES_LIST: ["Development", "SEO"],
}));
jest.mock(
  "../../../components/QuoteDetailModal",
  () =>
    ({ onClose }: { onClose: () => void }) => (
      <div data-testid="quote-modal">
        <button onClick={onClose}>close</button>
      </div>
    ),
);

import { useAdminDashboard } from "./useAdminDashboard";
const mockUseAdminDashboard = useAdminDashboard as jest.MockedFunction<
  typeof useAdminDashboard
>;

const baseHook = {
  t: (key: string) => key,
  adminEmail: "admin@test.com",
  logout: jest.fn(),
  activeTab: "quotes" as const,
  setActiveTab: jest.fn(),
  quotes: [],
  stats: null,
  statsLoading: false,
  pagination: { total: 0, page: 1, limit: 15, total_pages: 1 },
  loading: false,
  selectedQuote: null,
  setSelectedQuote: jest.fn(),
  search: "",
  setSearch: jest.fn(),
  serviceFilter: "",
  setServiceFilter: jest.fn(),
  startDate: "",
  setStartDate: jest.fn(),
  endDate: "",
  setEndDate: jest.fn(),
  fetchQuotes: jest.fn(),
  handleSearch: jest.fn(),
  clearFilters: jest.fn(),
  formatDate: (iso: string) => iso,
  toggleLang: jest.fn(),
  sentCount: "0",
  topService: "Development",
  hasActiveFilters: false,
};

describe("AdminDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAdminDashboard.mockReturnValue({ ...baseHook } as any);
  });

  it("renders sidebar with logo", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Quotify")).toBeInTheDocument();
  });

  it("renders admin email in topbar", () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/admin@test.com/)).toBeInTheDocument();
  });

  it('shows "no data" message when quotes list is empty', () => {
    render(<AdminDashboard />);
    expect(screen.getByText("admin.noData")).toBeInTheDocument();
  });

  it("calls setActiveTab when stats nav button is clicked", () => {
    const setActiveTab = jest.fn();
    mockUseAdminDashboard.mockReturnValue({ ...baseHook, setActiveTab } as any);
    render(<AdminDashboard />);
    fireEvent.click(screen.getByText("admin.stats"));
    expect(setActiveTab).toHaveBeenCalledWith("stats");
  });

  it("calls logout when logout button is clicked", () => {
    const logout = jest.fn();
    mockUseAdminDashboard.mockReturnValue({ ...baseHook, logout } as any);
    render(<AdminDashboard />);
    fireEvent.click(screen.getByText("admin.logout"));
    expect(logout).toHaveBeenCalled();
  });

  it("shows loading spinner when loading=true", () => {
    mockUseAdminDashboard.mockReturnValue({
      ...baseHook,
      loading: true,
    } as any);
    render(<AdminDashboard />);
    expect(
      document.querySelector(".confirmation__spinner"),
    ).toBeInTheDocument();
  });

  it("shows clear filter button when hasActiveFilters=true", () => {
    mockUseAdminDashboard.mockReturnValue({
      ...baseHook,
      hasActiveFilters: true,
    } as any);
    render(<AdminDashboard />);
    expect(screen.getByText("✕")).toBeInTheDocument();
  });

  it("hides clear filter button when hasActiveFilters=false", () => {
    render(<AdminDashboard />);
    expect(screen.queryByText("✕")).not.toBeInTheDocument();
  });

  it("calls clearFilters when ✕ button is clicked", () => {
    const clearFilters = jest.fn();
    mockUseAdminDashboard.mockReturnValue({
      ...baseHook,
      hasActiveFilters: true,
      clearFilters,
    } as any);
    render(<AdminDashboard />);
    fireEvent.click(screen.getByText("✕"));
    expect(clearFilters).toHaveBeenCalled();
  });

  it("renders quote rows when quotes are provided", () => {
    const quotes = [
      {
        id: "1",
        name: "Alice",
        email: "alice@test.com",
        services: ["Development"],
        timeline: "1 month",
        budget: "$1k",
        email_status: "sent",
        created_at: "2024-01-01T00:00:00Z",
      },
    ];
    mockUseAdminDashboard.mockReturnValue({ ...baseHook, quotes } as any);
    render(<AdminDashboard />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@test.com")).toBeInTheDocument();
  });

  it("shows stats tab content when activeTab=stats and statsLoading=true", () => {
    mockUseAdminDashboard.mockReturnValue({
      ...baseHook,
      activeTab: "stats",
      statsLoading: true,
    } as any);
    render(<AdminDashboard />);
    expect(
      document.querySelector(".confirmation__spinner"),
    ).toBeInTheDocument();
  });

  it("shows no stats message when activeTab=stats and stats=null", () => {
    mockUseAdminDashboard.mockReturnValue({
      ...baseHook,
      activeTab: "stats",
      statsLoading: false,
      stats: null,
    } as any);
    render(<AdminDashboard />);
    expect(screen.getByText("admin.noStats")).toBeInTheDocument();
  });
});
