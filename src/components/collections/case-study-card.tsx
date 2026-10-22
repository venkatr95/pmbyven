import Link from "next/link";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { caseStudyPageUrl, type CaseStudy } from "@/lib/case-studies";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const pageUrl = caseStudyPageUrl(study.slug);

  return (
    <article className="glass rounded-2xl overflow-hidden hover:shadow-lg transition-all">
      <Link href={`/collections/${study.slug}`} className="group block">
        <div className="relative aspect-[16/9] bg-muted">
          <OptimizedImage
            src={study.coverImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-6 pb-3">
          <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
            Case study
          </span>
          <h2 className="font-serif text-2xl group-hover:text-primary transition-colors mt-1">
            {study.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{study.description}</p>
          <p className="text-xs text-muted-foreground mt-3 break-all">{pageUrl}</p>
        </div>
      </Link>
      <div className="px-6 pb-6">
        <a
          href={study.githubUrl}
          className="text-sm text-primary underline-offset-4 hover:underline break-all"
        >
          {study.githubUrl}
        </a>
      </div>
    </article>
  );
}
