import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HomePage from "./HomePage";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("../../hooks/useTracking", () => ({
  useTracking: () => ({ track: jest.fn() }),
}));

jest.mock("../../services/api", () => ({
  api: {
    submitQuote: jest.fn(),
    trackEvent: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock("../../components/Navbar", () => () => <nav data-testid="navbar" />);
jest.mock("../../components/Footer", () => () => (
  <footer data-testid="footer" />
));

jest.mock(
  "../../components/steps/Step1",
  () =>
    ({ onNext }: { onNext: (d: object) => void }) => (
      <div data-testid="step-1">
        <button
          onClick={() =>
            onNext({
              name: "John",
              email: "j@j.com",
              phone: "",
              company_name: "",
            })
          }
        >
          step1-next
        </button>
      </div>
    ),
);

jest.mock(
  "../../components/steps/Step2",
  () =>
    ({ onNext }: { onNext: (d: object) => void }) => (
      <div data-testid="step-2">
        <button
          onClick={() => onNext({ service: "Development", other_service: "" })}
        >
          step2-next
        </button>
      </div>
    ),
);

jest.mock(
  "../../components/steps/Step3",
  () =>
    ({ onNext }: { onNext: (d: object) => void }) => (
      <div data-testid="step-3">
        <button onClick={() => onNext({ timeline: "1 month", budget: "$1k" })}>
          step3-next
        </button>
      </div>
    ),
);

jest.mock("../../components/steps/Step4", () => () => (
  <div data-testid="step-4" />
));

describe("HomePage", () => {
  it("renders navbar and footer", () => {
    render(<HomePage />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("shows step 1 by default", () => {
    render(<HomePage />);
    expect(screen.getByTestId("step-1")).toBeInTheDocument();
    expect(screen.queryByTestId("step-2")).not.toBeInTheDocument();
  });

  it("navigates to step 2 after step 1 is completed", () => {
    render(<HomePage />);
    fireEvent.click(screen.getByText("step1-next"));
    expect(screen.getByTestId("step-2")).toBeInTheDocument();
    expect(screen.queryByTestId("step-1")).not.toBeInTheDocument();
  });

  it("navigates to step 3 after step 2 is completed", () => {
    render(<HomePage />);
    fireEvent.click(screen.getByText("step1-next"));
    fireEvent.click(screen.getByText("step2-next"));
    expect(screen.getByTestId("step-3")).toBeInTheDocument();
  });

  it("navigates to step 4 after step 3 is completed", () => {
    render(<HomePage />);
    fireEvent.click(screen.getByText("step1-next"));
    fireEvent.click(screen.getByText("step2-next"));
    fireEvent.click(screen.getByText("step3-next"));
    expect(screen.getByTestId("step-4")).toBeInTheDocument();
  });
});
