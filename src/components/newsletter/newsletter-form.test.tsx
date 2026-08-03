import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { NewsletterForm } from "./newsletter-form";

vi.mock("@/lib/actions/newsletter", () => ({
  subscribeNewsletter: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { subscribeNewsletter } from "@/lib/actions/newsletter";
import { toast } from "sonner";

describe("NewsletterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email input and subscribe button", () => {
    render(<NewsletterForm />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeInTheDocument();
  });

  it("submits email and shows success toast", async () => {
    const user = userEvent.setup();
    vi.mocked(subscribeNewsletter).mockResolvedValue({ ok: true, integrations: [] });

    render(<NewsletterForm />);
    await user.type(screen.getByPlaceholderText(/email/i), "reader@example.com");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    await waitFor(() => {
      expect(subscribeNewsletter).toHaveBeenCalledWith("reader@example.com");
    });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("shows error toast on failure", async () => {
    const user = userEvent.setup();
    vi.mocked(subscribeNewsletter).mockResolvedValue({
      ok: false,
      error: "Invalid email",
    });

    render(<NewsletterForm />);
    await user.type(screen.getByPlaceholderText(/email/i), "bad@x");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("requires email input", () => {
    render(<NewsletterForm />);
    expect(screen.getByPlaceholderText(/email/i)).toBeRequired();
  });
});
