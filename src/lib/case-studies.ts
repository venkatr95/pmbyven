import { readFileSync } from "node:fs";
import path from "node:path";

/** Public case-study pages live under this path on the publication site. */
export const caseStudyBaseUrl = "https://www.pmbyven.com/collections";

export type CaseStudy = {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  /** Folder in https://github.com/venkatr95/case-study-products */
  githubUrl: string;
  /** Hosted prototype. The case-study page links here as the live demo. */
  demoUrl: string;
  overviewFile: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "moneymind",
    title: "MoneyMind",
    description:
      "Know when you may run short of money before it happens. A 30-day cash estimate from amounts you type. Not a bank balance or financial advice.",
    coverImage: "/case-studies/moneymind-cover.png",
    githubUrl: "https://github.com/venkatr95/case-study-products/tree/main/01-MoneyMind",
    demoUrl: "https://pmbyven-moneymind.vercel.app",
    overviewFile: "content/case-studies/moneymind/overview.md",
  },
];

export function caseStudyPageUrl(slug: string) {
  return `${caseStudyBaseUrl}/${slug}`;
}

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug) ?? null;
}

export function readCaseStudyOverview(study: CaseStudy) {
  return readFileSync(path.join(process.cwd(), study.overviewFile), "utf8");
}
