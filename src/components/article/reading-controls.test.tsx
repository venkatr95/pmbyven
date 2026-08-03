import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import {
  ArticleActions,
  ReadingProgressBar,
  ReaderWidthWrapper,
} from "./reading-controls";
import { useReaderStore } from "@/store/reader";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("ReadingProgressBar", () => {
  it("renders a progressbar", () => {
    render(<ReadingProgressBar />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});

describe("ReaderWidthWrapper", () => {
  beforeEach(() => {
    useReaderStore.setState({ readingWidth: "normal", distractionFree: false });
  });

  it("applies width class from store", () => {
    const { container } = render(
      <ReaderWidthWrapper>
        <p>Body</p>
      </ReaderWidthWrapper>
    );
    expect(container.firstChild).toHaveClass("reader-normal");
  });

  it("applies wide width", () => {
    useReaderStore.setState({ readingWidth: "wide" });
    const { container } = render(
      <ReaderWidthWrapper>
        <p>Body</p>
      </ReaderWidthWrapper>
    );
    expect(container.firstChild).toHaveClass("reader-wide");
  });
});

describe("ArticleActions", () => {
  beforeEach(() => {
    useReaderStore.setState({
      bookmarks: [],
      recentlyViewed: [],
      fontSize: 18,
      readingWidth: "normal",
      distractionFree: false,
      fullscreen: false,
      readingStreak: 0,
      lastReadDate: null,
    });
  });

  it("renders engagement and share controls", () => {
    render(
      <ArticleActions
        slug="demo-post"
        title="Demo"
        likes={10}
        commentsCount={2}
        shares={1}
      />
    );
    expect(screen.getByText((_, el) => el?.textContent === "♥ 10")).toBeInTheDocument();
    expect(screen.getByLabelText("Share")).toBeInTheDocument();
    expect(screen.getByLabelText("Bookmark")).toBeInTheDocument();
    expect(screen.getByLabelText("Copy link")).toBeInTheDocument();
    expect(screen.getByLabelText("Print")).toBeInTheDocument();
  });

  it("toggles bookmark on click", async () => {
    const user = userEvent.setup();
    render(<ArticleActions slug="demo-post" title="Demo" />);
    await user.click(screen.getByLabelText("Bookmark"));
    await waitFor(() => {
      expect(useReaderStore.getState().isBookmarked("demo-post")).toBe(true);
    });
  });

  it("copies link and shows confirmation icon", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    const user = userEvent.setup();
    render(<ArticleActions slug="demo-post" title="Demo" />);
    await user.click(screen.getByLabelText("Copy link"));

    await waitFor(() => {
      // Check icon replaces link icon when copy succeeds
      expect(document.querySelector(".lucide-check")).toBeTruthy();
    });
  });
});
