# SkillBridge — executive summary

**Turn the skills you already have into a clear path to your next role.**

SkillBridge is a portfolio prototype for someone exploring a next role. They confirm skills they already have, compare those skills with one illustrative role profile, and leave with at most three actions. The folder is `04-CareerNavigator`. The name in the interface is SkillBridge. It does not predict hiring, pay, or interviews.

**Status, 22 October 2026:** Design and prototype are complete for review. No interviews or usability tests have been run. The problem, the personas, and the success targets remain hypotheses.

## Problem and audience

The working hypothesis is that people have trouble translating work they already do into the language of a new role, and a long learning list does not name a next step. That hypothesis is not yet tested with participants.

**Primary audience:** career changers and early-career professionals exploring a next role. **Secondary:** learners planning skills around one job goal. **Not for:** recruiters or employers screening candidates.

Two proto-personas in `02-ux-research/personas.md` are sketches only. Maya Chen, in the prototype, is fictional sample data, not a user.

## Solution and primary journey

The person sees the limit first, chooses or writes a role, and reads that profile’s source and date. They add skills with a proficiency and a confidence, or confirm resume suggestions one by one. The comparison is sentences: matched, partial, and not in your list. There is no match score. The first plan saves at most three actions. Each action can be edited, marked done, and undone.

**Match rule, verified in code:** comfortable or strong, plus medium or high confidence, is matched. Anything listed but weaker or less sure is partial. A skill on the profile that they have not added is not in your list. Skills they listed that the profile does not include still count.

Primary journey: read the limit, open Maya’s sample or choose a role, read the comparison in words, then save the three-action plan.

## Design decisions

- No percentage, grade, or hireability label. Whether people feel lost without a number is untested.
- An empty skill list does not become a wall of gaps.
- Illustrative profiles are dated 22 Oct 2026 and say they are not O*NET and not an employer posting.
- Paste is reviewed before save and is not stored. Suggestions start at practicing and low confidence.
- Visual direction is a field notebook: paper, one teal, amber for partial, slate for absence, red only for destructive confirmation.

Public pages reviewed on 22 October 2026, and written up in `01-product-analysis/competitive-analysis.md`, include Jobscan, Teal, roadmap.sh, CareerOneStop, and O*NET. LinkedIn was not walked through while signed in. Those products, as documented, center a match rate or score, a developer curriculum, or an occupation report. SkillBridge does not copy the rate, the wages, or a top-applicant label.

## What is implemented

The Vite and TypeScript app in `app/` has no server and no model. It includes goals, custom roles, skills, comparison, gap detail, a three-action roadmap, progress, paste review, example links where a template has one, settings, delete, and an unreadable-data screen. Five learning links are labeled examples, not a catalog. Some actions have none. Entries stay in this browser under `skillbridge.career-navigator.v1`.

Documented checks on 22 October 2026: automated tests passed; the production build succeeded; Chrome captured 21 screenshots in `assets/screenshots/`. A toast that covered the next card was fixed before those roadmap and review screenshots were recaptured. That fix is an engineering correction, not a user-test result.

## Evidence

| Topic | Status |
| --- | --- |
| Competitor pages | Documented from public sources opened 22 October 2026. Signed-in flows were not reviewed. |
| Interviews and usability tests | Planned. Findings files are empty. No quotes. |
| PRD targets (80% / 70% / 80%) | Hypotheses. No results. |
| Profiles and resources | Illustrative. No named editor or link maintainer. |
| Accessibility | Contrast checked against the tokens. Not audited with a screen reader. |

## Limits and next steps

Main risks: the role family may be wrong; people may need a score or a specific posting; illustrative profiles may be read as standards; the phrase extractor will miss real resume wording. There is no account, sync, or server. Regional pay, job listings, mentorship, and portfolio projects are out of scope. There is no Figma file. Wireframes are 15 annotated SVGs.

1. Run the interview guide with people who recently looked at a different role.
2. Run usability tasks U1–U5 before changing the no-score rule or the three-action cap.
3. Give any profile that remains a named editor, a cited source, and a review date.
4. Replace the example links with a maintained set, or remove them when they go stale.
5. Do not report hiring, satisfaction, or business impact until a real study exists.

## Where the work lives

Start at `04-CareerNavigator/README.md`. Prototype: `app/`. Wireframes: `assets/wireframes/`. Screenshots: `assets/screenshots/`. Check notes: `IMPLEMENTATION-REPORT.md`. Full report: `09-case-study/case-study-report.pdf`.
