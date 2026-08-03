import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { Hero } from "./hero";
import type { PostCardData } from "@/components/posts/post-card";

const featured: PostCardData = {
  id: "1",
  title: "11 products I love, free for a year",
  slug: "product-pass-expansion",
  excerpt: "The biggest Product Pass expansion in 2 years.",
  readingTime: 8,
  views: 48000,
  publishedAt: new Date("2026-07-28"),
  author: { name: "Alex Rivera", slug: "alex-rivera" },
  category: { name: "Product", slug: "product" },
};

describe("Hero", () => {
  it("renders featured article when post is provided", () => {
    render(<Hero post={featured} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      featured.title
    );
    expect(screen.getByText(featured.excerpt!)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /read article/i })).toHaveAttribute(
      "href",
      `/blog/${featured.slug}`
    );
  });

  it("shows author and reading time", () => {
    render(<Hero post={featured} />);
    expect(screen.getByText("Alex Rivera")).toBeInTheDocument();
    expect(screen.getByText(/8 min read/)).toBeInTheDocument();
  });

  it("renders empty-state marketing copy when no post", () => {
    render(<Hero post={null} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Apple designed Medium/i
    );
    expect(screen.getByRole("link", { name: /explore articles/i })).toHaveAttribute(
      "href",
      "/blog"
    );
  });
});
