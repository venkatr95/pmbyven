import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { AdminLogin } from "./admin-login";

vi.mock("@/lib/actions/admin", () => ({
  loginAdmin: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import { loginAdmin } from "@/lib/actions/admin";
import { toast } from "sonner";

describe("AdminLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders secret form", () => {
    render(<AdminLogin />);
    expect(screen.getByText(/admin access/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/admin secret/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /enter dashboard/i })
    ).toBeInTheDocument();
  });

  it("shows error on invalid secret", async () => {
    const user = userEvent.setup();
    vi.mocked(loginAdmin).mockResolvedValue({ ok: false, error: "Invalid admin secret" });

    render(<AdminLogin />);
    await user.type(screen.getByLabelText(/admin secret/i), "wrong");
    await user.click(screen.getByRole("button", { name: /enter dashboard/i }));

    await waitFor(() => {
      expect(loginAdmin).toHaveBeenCalledWith("wrong");
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("succeeds with valid secret", async () => {
    const user = userEvent.setup();
    vi.mocked(loginAdmin).mockResolvedValue({ ok: true });

    render(<AdminLogin />);
    await user.type(screen.getByLabelText(/admin secret/i), "pmbyven-admin-2026");
    await user.click(screen.getByRole("button", { name: /enter dashboard/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });
});
