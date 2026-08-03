import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { Input } from "./input";

describe("Input", () => {
  it("renders with placeholder", () => {
    render(<Input placeholder="Type your email…" aria-label="Email" />);
    expect(screen.getByPlaceholderText("Type your email…")).toBeInTheDocument();
  });

  it("accepts user input", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Email" />);
    const input = screen.getByLabelText("Email");
    await user.type(input, "reader@example.com");
    expect(input).toHaveValue("reader@example.com");
  });

  it("calls onChange", async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Name"), "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("supports disabled state", () => {
    render(<Input disabled aria-label="Locked" />);
    expect(screen.getByLabelText("Locked")).toBeDisabled();
  });
});
