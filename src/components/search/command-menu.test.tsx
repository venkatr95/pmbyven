import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { CommandMenu } from "./command-menu";

describe("CommandMenu", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [
            {
              id: "1",
              title: "Typography is a product decision",
              slug: "typography-product-decision",
              type: "post",
              excerpt: "Font choice matters",
              category: "Design",
            },
          ],
        }),
      })
    );
  });

  it("does not render content when closed", () => {
    render(<CommandMenu open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByPlaceholderText(/search articles/i)).not.toBeInTheDocument();
  });

  it("renders search input when open", async () => {
    render(<CommandMenu open={true} onOpenChange={vi.fn()} />);
    expect(await screen.findByPlaceholderText(/search articles/i)).toBeInTheDocument();
  });

  it("fetches and shows results", async () => {
    const user = userEvent.setup();
    render(<CommandMenu open={true} onOpenChange={vi.fn()} />);

    const input = await screen.findByPlaceholderText(/search articles/i);
    await user.type(input, "typography");

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByText("Typography is a product decision")
      ).toBeInTheDocument();
    });
  });
});
