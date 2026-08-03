import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const db = new PrismaClient({ adapter });

const articleBody = `Hey there. Each week I share deeply researched product, design, and craft advice — the kind of writing that helps you ship better work.

If you thought this publication couldn't get any better, you ain't seen nothing yet.

## Why this matters

Great products aren't accidents. They come from **obsessive craft**, clear thinking, and the willingness to cut everything that doesn't serve the reader.

> The best writing feels inevitable — as if the words were always meant to be in that order.

### The craft stack

1. **Clarity first** — If a sentence confuses, rewrite it.
2. **Depth over volume** — One great insight beats ten shallow takes.
3. **Respect attention** — Your reader's time is the scarcest resource.

## A framework that works

Here's a simple framework I use when evaluating any product decision:

| Dimension | Question | Weight |
|-----------|----------|--------|
| Impact | Does this move the needle? | High |
| Effort | Can we ship this week? | Medium |
| Risk | What's the downside? | Medium |
| Learning | Will we learn something? | Low |

### Dropping into the details

When you're deep in the weeds, it's easy to lose the plot. Step back. Ask: *what would the user notice first?*

\`\`\`ts
function prioritize(features: Feature[]): Feature[] {
  return features
    .map(f => ({ ...f, score: f.impact / f.effort }))
    .sort((a, b) => b.score - a.score);
}
\`\`\`

<Callout type="info" title="Pro tip">
Always prototype the riskiest assumption first. It saves months of wasted polish.
</Callout>

## What great teams do differently

They treat documentation as a product. They review writing the way they review code. They measure *understanding*, not just pageviews.

<PullQuote>
Ship the essay you'd want to read on a Sunday morning.
</PullQuote>

### Three practices

- Write the outline as questions, not statements
- Kill your darlings — cut the clever line that doesn't earn its place
- End with a clear next step for the reader

## Closing thoughts

Premium experiences aren't about more features. They're about **restraint**, typography, spacing, and motion that feels like air — present but invisible.

Thanks for reading. If this resonated, share it with someone who cares about craft.

---

*Footnote: This piece was written as demo content for the pmbyven platform seed.*
`;

const articles = [
  {
    title: "11 products I love, free for a year—the biggest Product Pass expansion in 2 years",
    slug: "product-pass-expansion",
    excerpt:
      "Runway, Higgsfield, Waking Up, Brain.fm, Customer.io, Resend, Pangram, Mercury Personal, Supercut, Readwise, and Jam are joining Product Pass today.",
    featured: true,
    editorsPick: true,
    views: 48200,
    likes: 304,
    commentsCount: 9,
    shares: 6,
    category: "product",
    tags: ["product", "tools", "newsletter"],
    coverImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
  },
  {
    title: "How to build a design system that engineers actually use",
    slug: "design-system-engineers-love",
    excerpt:
      "Most design systems die in Figma. Here's the operating model that keeps them alive in production.",
    featured: false,
    editorsPick: true,
    views: 22100,
    likes: 189,
    commentsCount: 24,
    shares: 41,
    category: "design",
    tags: ["design", "systems", "engineering"],
    coverImage:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
  },
  {
    title: "The art of the one-page product brief",
    slug: "one-page-product-brief",
    excerpt:
      "Cut the 40-page PRD. A tight brief forces clarity — and ships better products.",
    featured: false,
    editorsPick: true,
    views: 18500,
    likes: 156,
    commentsCount: 18,
    shares: 33,
    category: "product",
    tags: ["product", "process", "writing"],
    coverImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
  },
  {
    title: "Typography is a product decision",
    slug: "typography-product-decision",
    excerpt:
      "Font choice, line length, and rhythm change conversion more than most teams admit.",
    featured: false,
    editorsPick: false,
    views: 14200,
    likes: 98,
    commentsCount: 12,
    shares: 22,
    category: "design",
    tags: ["typography", "design", "ux"],
    coverImage:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80",
  },
  {
    title: "Motion with intention: Framer Motion patterns for editorial apps",
    slug: "motion-intention-editorial",
    excerpt:
      "Scroll reveals, shared layouts, and glass morphs — without making users sea-sick.",
    featured: false,
    editorsPick: true,
    views: 9800,
    likes: 112,
    commentsCount: 8,
    shares: 19,
    category: "engineering",
    tags: ["motion", "frontend", "react"],
    coverImage:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
  },
  {
    title: "Glassmorphism done right (and when to skip it)",
    slug: "glassmorphism-done-right",
    excerpt:
      "Apple Vision Pro aesthetics on the web: blur, hairlines, and depth without muddy contrast.",
    featured: false,
    editorsPick: false,
    views: 16700,
    likes: 134,
    commentsCount: 15,
    shares: 28,
    category: "design",
    tags: ["design", "ui", "glass"],
    coverImage:
      "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1200&q=80",
  },
  {
    title: "Building a content engine with MDX and server components",
    slug: "mdx-server-components",
    excerpt:
      "A practical architecture for rich editorial content on Next.js 15 — without a heavy CMS tax.",
    featured: false,
    editorsPick: false,
    views: 11200,
    likes: 87,
    commentsCount: 11,
    shares: 15,
    category: "engineering",
    tags: ["nextjs", "mdx", "architecture"],
    coverImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
  },
  {
    title: "Reading experiences that feel like books, not blogs",
    slug: "reading-experiences-books",
    excerpt:
      "Progress bars, TOC, width controls, distraction-free mode — the details that keep people finishing.",
    featured: false,
    editorsPick: false,
    views: 8900,
    likes: 76,
    commentsCount: 7,
    shares: 12,
    category: "product",
    tags: ["ux", "reading", "product"],
    coverImage:
      "https://images.unsplash.com/photo-1456513080080-4f59d7d5f5d0?w=1200&q=80",
  },
  {
    title: "The weekly archive: how great newsletters stay timeless",
    slug: "weekly-archive-timeless",
    excerpt:
      "Evergreen structure, series, and search — so your best work compounds for years.",
    featured: false,
    editorsPick: false,
    views: 6400,
    likes: 54,
    commentsCount: 5,
    shares: 9,
    category: "writing",
    tags: ["newsletter", "content", "archive"],
    coverImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
  },
  {
    title: "From draft to published: an editorial workflow that scales",
    slug: "editorial-workflow-scales",
    excerpt:
      "Revisions, scheduling, SEO previews, and autosave — the admin side of a world-class pub.",
    featured: false,
    editorsPick: false,
    views: 7300,
    likes: 61,
    commentsCount: 6,
    shares: 11,
    category: "product",
    tags: ["cms", "workflow", "admin"],
    coverImage:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80",
  },
];

async function main() {
  console.log("Seeding pmbyven database…");

  await db.analyticsEvent.deleteMany();
  await db.revision.deleteMany();
  await db.postTag.deleteMany();
  await db.post.deleteMany();
  await db.tag.deleteMany();
  await db.category.deleteMany();
  await db.series.deleteMany();
  await db.author.deleteMany();
  await db.subscriber.deleteMany();
  await db.media.deleteMany();
  await db.menuItem.deleteMany();
  await db.menu.deleteMany();
  await db.setting.deleteMany();
  await db.themeConfig.deleteMany();
  await db.page.deleteMany();
  await db.collection.deleteMany();
  await db.announcement.deleteMany();
  await db.readingList.deleteMany();
  await db.pinnedNote.deleteMany();

  const author = await db.author.create({
    data: {
      name: "Alex Rivera",
      slug: "alex-rivera",
      email: "alex@pmbyven.com",
      bio: "Founder & editor. Writing about product, design, and craft. Previously at companies you've heard of.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
      twitter: "alexrivera",
      website: "https://pmbyven.com",
      role: "editor",
    },
  });

  const coauthor = await db.author.create({
    data: {
      name: "Sam Chen",
      slug: "sam-chen",
      email: "sam@pmbyven.com",
      bio: "Staff writer covering engineering systems and motion design.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      role: "writer",
    },
  });

  const cats = await Promise.all(
    [
      { name: "Product", slug: "product", description: "Product strategy, process, and craft", icon: "📦", color: "#3b82f6", featured: true, order: 1 },
      { name: "Design", slug: "design", description: "Visual systems, UX, and typography", icon: "✨", color: "#8b5cf6", featured: true, order: 2 },
      { name: "Engineering", slug: "engineering", description: "Architecture, frontend, and tooling", icon: "⚙️", color: "#10b981", featured: true, order: 3 },
      { name: "Writing", slug: "writing", description: "Editorial craft and storytelling", icon: "✍️", color: "#f59e0b", featured: false, order: 4 },
    ].map((c) => db.category.create({ data: c }))
  );

  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c]));

  const tagNames = [
    "product",
    "tools",
    "newsletter",
    "design",
    "systems",
    "engineering",
    "process",
    "writing",
    "typography",
    "ux",
    "motion",
    "frontend",
    "react",
    "ui",
    "glass",
    "nextjs",
    "mdx",
    "architecture",
    "reading",
    "content",
    "archive",
    "cms",
    "workflow",
    "admin",
  ];

  const tags = await Promise.all(
    tagNames.map((name) =>
      db.tag.create({ data: { name, slug: name, count: 0 } })
    )
  );
  const tagMap = Object.fromEntries(tags.map((t) => [t.slug, t]));

  const series = await db.series.create({
    data: {
      title: "Building pmbyven",
      slug: "building-pmbyven",
      description: "A multi-part series on designing and shipping a premium publication platform.",
      coverImage:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
      order: 1,
    },
  });

  const now = Date.now();
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    const words = articleBody.trim().split(/\s+/).length;
    const post = await db.post.create({
      data: {
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: articleBody,
        coverImage: a.coverImage,
        status: "published",
        featured: a.featured,
        editorsPick: a.editorsPick,
        pinned: i < 2,
        views: a.views,
        likes: a.likes,
        commentsCount: a.commentsCount,
        shares: a.shares,
        readingTime: Math.ceil(words / 200),
        wordCount: words,
        publishedAt: new Date(now - i * 86400000 * 3),
        dropCap: i % 2 === 0,
        authorId: i % 3 === 0 ? coauthor.id : author.id,
        categoryId: catMap[a.category]?.id,
        seriesId: i < 3 ? series.id : null,
        seriesOrder: i < 3 ? i + 1 : null,
        seoTitle: a.title,
        seoDescription: a.excerpt,
      },
    });

    for (const tagSlug of a.tags) {
      const tag = tagMap[tagSlug];
      if (tag) {
        await db.postTag.create({ data: { postId: post.id, tagId: tag.id } });
        await db.tag.update({
          where: { id: tag.id },
          data: { count: { increment: 1 } },
        });
      }
    }

    await db.revision.create({
      data: {
        postId: post.id,
        title: post.title,
        content: post.content,
      },
    });
  }

  await db.subscriber.createMany({
    data: [
      { email: "reader@example.com", name: "Early Reader", status: "active", source: "seed" },
      { email: "design@studio.io", name: "Design Studio", status: "active", source: "seed" },
      { email: "pm@startup.com", status: "active", source: "website" },
    ],
  });

  await db.media.createMany({
    data: [
      {
        filename: "hero-gradient.jpg",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
        alt: "Abstract gradient art",
        mimeType: "image/jpeg",
        folder: "covers",
      },
      {
        filename: "workspace.jpg",
        url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80",
        alt: "Workspace with laptop",
        mimeType: "image/jpeg",
        folder: "general",
      },
    ],
  });

  const headerMenu = await db.menu.create({
    data: { name: "Header", location: "header" },
  });
  await db.menuItem.createMany({
    data: [
      { menuId: headerMenu.id, label: "Blog", href: "/blog", order: 1 },
      { menuId: headerMenu.id, label: "Categories", href: "/categories", order: 2 },
      { menuId: headerMenu.id, label: "Topics", href: "/topics", order: 3 },
      { menuId: headerMenu.id, label: "Archive", href: "/archive", order: 4 },
      { menuId: headerMenu.id, label: "About", href: "/about", order: 5 },
    ],
  });

  await db.themeConfig.create({
    data: {
      name: "default",
      activeTheme: "warm",
      homepageSections: JSON.stringify([
        "featured",
        "editorsPicks",
        "latest",
        "trending",
        "mostRead",
        "categories",
        "topics",
        "series",
        "newsletter",
        "tags",
      ]),
    },
  });

  await db.setting.createMany({
    data: [
      { key: "site_name", value: "pmbyven" },
      { key: "site_tagline", value: "If Apple designed Medium" },
      { key: "posts_per_page", value: "12" },
      { key: "enable_comments", value: "false" },
    ],
  });

  await db.page.createMany({
    data: [
      {
        title: "About",
        slug: "about",
        content:
          "pmbyven is a premium publication platform built for writers who care about craft. Inspired by the best newsletters and Apple's design language.",
        status: "published",
      },
      {
        title: "Privacy",
        slug: "privacy",
        content:
          "We respect your privacy. We collect only what's needed to deliver the newsletter and improve the product. No selling of data.",
        status: "published",
      },
      {
        title: "Terms",
        slug: "terms",
        content:
          "By using pmbyven you agree to use the service responsibly and respect copyright of published content.",
        status: "published",
      },
      {
        title: "Contact",
        slug: "contact",
        content: "Reach us at hello@pmbyven.com for partnerships, tips, and feedback.",
        status: "published",
      },
    ],
  });

  const allPosts = await db.post.findMany({ select: { id: true }, take: 5 });
  await db.collection.create({
    data: {
      title: "Craft essentials",
      slug: "craft-essentials",
      description: "Must-read essays on product, design, and writing craft.",
      featured: true,
      coverImage:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
      postIds: JSON.stringify(allPosts.map((p) => p.id)),
      order: 1,
    },
  });

  await db.announcement.create({
    data: {
      message: "New: Product Pass expansion essay is live — 11 tools free for a year.",
      href: "/blog/product-pass-expansion",
      active: true,
    },
  });

  await db.readingList.create({
    data: {
      title: "Editor's reading list",
      slug: "editors-reading-list",
      description: "Public reading list curated by the editorial team.",
      postIds: JSON.stringify(allPosts.slice(0, 3).map((p) => p.id)),
      public: true,
    },
  });

  await db.pinnedNote.create({
    data: {
      title: "How we write",
      body: "Every essay ships with a clear thesis, one framework, and a next step for the reader. No filler.",
      color: "amber",
      global: true,
      pinned: true,
      order: 0,
    },
  });

  if (allPosts[0]) {
    await db.pinnedNote.create({
      data: {
        title: "Insider tip",
        body: "This piece pairs well with the Product Pass series — start there if you're new.",
        color: "blue",
        global: false,
        pinned: true,
        postId: allPosts[0].id,
        order: 0,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
