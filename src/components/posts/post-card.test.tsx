import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { PostCard, type PostCardData } from "./post-card";

const basePost: PostCardData = {
  id: "1",
  title: "Typography is a product decision",
  slug: "typography-product-decision",
  excerpt: "Font choice changes conversion.",
  coverImage: "https://example.com/cover.jpg",
  readingTime: 6,
  views: 14200,
  publishedAt: new Date("2026-07-01"),
  featured: true,
  editorsPick: true,
  author: {
    name: "Alex Rivera",
    slug: "alex-rivera",
    avatar: null,
  },
  category: {
    name: "Design",
    slug: "design",
  },
};

describe("PostCard", () => {
  it("renders default card with title and excerpt", () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText(basePost.title)).toBeInTheDocument();
    expect(screen.getByText(basePost.excerpt!)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/blog/${basePost.slug}`
    );
  });

  it("shows featured and editor badges", () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText("Featured")).toBeInTheDocument();
    expect(screen.getByText(/Editor/)).toBeInTheDocument();
  });

  it("renders compact variant with index", () => {
    render(<PostCard post={basePost} variant="compact" index={0} />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText(basePost.title)).toBeInTheDocument();
  });

  it("renders horizontal variant", () => {
    render(<PostCard post={basePost} variant="horizontal" />);
    expect(screen.getByText(basePost.title)).toBeInTheDocument();
    expect(screen.getByText("Design")).toBeInTheDocument();
  });

  it("shows author name when provided", () => {
    render(<PostCard post={basePost} />);
    expect(screen.getByText("Alex Rivera")).toBeInTheDocument();
  });
});
