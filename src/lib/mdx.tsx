import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/utils";
import { CodeBlock, InlineCode } from "@/components/mdx/code-block";
import {
  YouTube,
  Tweet,
  Spotify,
  GitHubGist,
  FigmaEmbed,
  Loom,
  PdfEmbed,
  VideoEmbed,
} from "@/components/mdx/embeds";
import {
  Expandable,
  Accordion,
  LightboxImage,
  ImageGallery,
  ComparisonSlider,
  Mermaid,
  MathBlock,
  Footnote,
  Footnotes,
  Highlight,
  TabsMDX,
} from "@/components/mdx/interactive";

function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "warning" | "success" | "danger";
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("callout", `callout-${type}`)}>
      {title && <div className="font-semibold mb-1 text-sm">{title}</div>}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return <blockquote className="pull-quote">{children}</blockquote>;
}

const components = {
  Callout,
  PullQuote,
  YouTube,
  Tweet,
  Spotify,
  GitHubGist,
  FigmaEmbed,
  Loom,
  PdfEmbed,
  VideoEmbed,
  Expandable,
  Accordion,
  LightboxImage,
  ImageGallery,
  ComparisonSlider,
  Mermaid,
  MathBlock,
  Footnote,
  Footnotes,
  Highlight,
  Tabs: TabsMDX,
  TabsMDX,
  pre: CodeBlock,
  code: InlineCode,
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 {...props} />,
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h4 {...props} />,
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h5 {...props} />,
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h6 {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
    />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <LightboxImage src={String(props.src || "")} alt={props.alt || ""} />
  ),
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table {...props} />
    </div>
  ),
  mark: Highlight,
};

export async function MdxContent({
  source,
  dropCap,
}: {
  source: string;
  dropCap?: boolean;
}) {
  return (
    <div className={cn("prose-editorial mx-auto", dropCap && "[&>p:first-of-type]:drop-cap")}>
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
              rehypeKatex,
            ],
          },
        }}
      />
    </div>
  );
}

export function extractHeadings(content: string) {
  const headingRegex = /^(#{1,4})\s+(.+)$/gm;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/[*_`]/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ level, text, id });
  }
  return headings;
}
