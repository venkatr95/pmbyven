import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { ArticleSidebar } from "./article-sidebar";

describe("ArticleSidebar", () => {
  it("renders author card", () => {
    render(
      <ArticleSidebar
        author={{
          name: "Alex Rivera",
          slug: "alex-rivera",
          bio: "Founder & editor.",
        }}
        related={[]}
        popular={[]}
      />
    );
    expect(screen.getByText("Alex Rivera")).toBeInTheDocument();
    expect(screen.getByText("Founder & editor.")).toBeInTheDocument();
  });

  it("renders related and popular lists", () => {
    render(
      <ArticleSidebar
        related={[{ id: "1", title: "Related post", slug: "related", views: 100 }]}
        popular={[{ id: "2", title: "Popular post", slug: "popular", views: 999 }]}
      />
    );
    expect(screen.getByText("Related")).toBeInTheDocument();
    expect(screen.getByText("Related post")).toBeInTheDocument();
    expect(screen.getByText("Popular")).toBeInTheDocument();
    expect(screen.getByText("Popular post")).toBeInTheDocument();
  });

  it("renders series and tags", () => {
    render(
      <ArticleSidebar
        related={[]}
        popular={[]}
        series={{ title: "Building pmbyven", slug: "building-pmbyven" }}
        tags={[
          { name: "design", slug: "design" },
          { name: "product", slug: "product" },
        ]}
      />
    );
    expect(screen.getByText("Building pmbyven")).toBeInTheDocument();
    expect(screen.getByText("design")).toBeInTheDocument();
    expect(screen.getByText("product")).toBeInTheDocument();
  });
});
