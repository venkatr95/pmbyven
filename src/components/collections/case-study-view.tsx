import { MdxContent } from "@/lib/mdx";
import { buttonVariants } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { caseStudyPageUrl, readCaseStudyOverview, type CaseStudy } from "@/lib/case-studies";

export async function CaseStudyView({ study }: { study: CaseStudy }) {
  const overview = readCaseStudyOverview(study);
  const pageUrl = caseStudyPageUrl(study.slug);

  return (
    <div className="pt-28 pb-20">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <Breadcrumbs
          className="mb-6"
          items={[
            { label: "Collections", href: "/collections" },
            { label: study.title },
          ]}
        />
        <p className="text-[10px] uppercase tracking-wider text-primary font-semibold">Case study</p>
        <h1 className="font-serif text-4xl tracking-tight mt-2">{study.title}</h1>
        <p className="text-muted-foreground mt-3">{study.description}</p>
        <p className="text-sm text-muted-foreground mt-4 break-all">{pageUrl}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href={study.demoUrl} className={cn(buttonVariants({ variant: "cta" }))}>
            Visit live demo
          </a>
          <a
            href={study.githubUrl}
            className="text-sm text-primary underline-offset-4 hover:underline break-all"
          >
            {study.githubUrl}
          </a>
        </div>
        <div className="mt-12">
          <MdxContent source={overview} />
        </div>
      </article>
    </div>
  );
}
