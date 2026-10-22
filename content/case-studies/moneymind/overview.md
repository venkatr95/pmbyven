# MoneyMind — executive summary

**Know when you may run short of money before it happens.**

MoneyMind is a mobile-first portfolio prototype. A person types a current balance, expected income, and upcoming bills. The app builds a 30-day cash estimate and a safe-to-spend figure, then shows the math. It does not connect to a bank, move money, or give financial advice.

**Status, 22 October 2026:** Design and prototype are complete for review. No interviews or usability tests have been run. The problem, the personas, and the success targets remain hypotheses.

## Problem and audience

The working hypothesis is that people decide from a balance that is already partly committed to bills due before the next deposit. The job in the product requirements is: when deciding whether they can afford a purchase, understand upcoming commitments and the likely balance.

Two proto-personas guide the design. They are sketches, not interviewed people. Hypothesis A is a payday-gap planner, with a monthly bill between biweekly paychecks. Hypothesis B is an irregular-income planner who can name the next expected deposit. Traders, advisers, bookkeepers, and shared household ledgers are out of scope.

## Solution and primary journey

Safe to spend is the lowest estimated balance in the next 30 days, minus a set-aside the person chooses, including zero. The low-point date and the items that create it stay on screen. Income after that date stays on the timeline and is left out of the spendable figure. Same-day bills are counted before same-day income. The result is one labeled estimate.

Primary journey: read safe to spend, open the calculation, try one purchase as an unsaved scenario, then discard it or add it to the plan.

## Design decisions

- The trough is visible beside the headline number, and the formula is one step away.
- Decision screens carry this line: “Estimate only. Not a guarantee, a bank balance, or financial advice.”
- A what-if stays visually separate until the person chooses Add to plan.
- The visual direction is “Clear ledger”: warm paper, readable type, teal for actions, and rust only with words when the estimate is short of the set-aside. One light theme.
- Below 880px the main destinations sit in a bottom bar. From 880px they move to a left column. A data table repeats the chart.
- Missing production capabilities are stated in the interface: storage is local and unencrypted, and a device notification can appear only while the page is open.

## What is implemented

The browser prototype is in `01-MoneyMind/app/`. Source is TypeScript, compiled to `app/dist`, with no UI framework. It includes a manual plan, a 30-day timeline, the explanation, add/edit/delete with one undo, what-if, a category summary that does not change the estimate, a local JSON export, an in-app low-balance alert, and empty, error, stale, and offline states. Sample data stays labeled until it is removed.

An illustrative fixture — balance $1,840, set-aside $100, rent before payday — calculates a lowest estimate of $190 and safe to spend of $90 when its dates line up. That is tested arithmetic, not a user result. See `app/test/forecast.test.ts`.

## Evidence

| Topic | Status |
| --- | --- |
| Competitor pages and help articles | Reviewed 22 October 2026. Some prices were not reopened on vendor pricing pages. |
| Interviews and the journey map | Planned. `02-ux-research/research-findings.md` is empty. |
| Forecast math | 18 unit tests passed on 22 October 2026. |
| Primary browser path | Headless Chrome smoke passed the same day, including a 390px fit check. |
| Usability | Six scenarios are written. No participants. |
| Success targets (70% comprehension, 60% add at least three items, 80% unaided afford task, under 10% treat the forecast as guaranteed) | Targets in the requirements. Not measured. |

## Limits and next steps

`localStorage` under `moneymind.v1` is unencrypted, so the prototype is not fit for live financial data. There is no bank link, no background alert, no service worker, one currency symbol, and no probability range. WCAG 2.2 AA is a design target, not a certificate. There is no Figma file. Wireframes are annotated SVGs.

1. Interview 5–8 people with `02-ux-research/interview-guide.md` before treating the problem as confirmed.
2. Run the sessions in `08-usability-testing/` with five participants. Leave the findings template empty until a real session.
3. Decide currency, retention, and whether a set-aside should ever be suggested.
4. Replace local storage before anyone enters live financial data.
5. Leave bank linking out until the manual explanation survives a usability test.

## Where the work lives

Start at `01-MoneyMind/README.md`. Prototype: `app/`. Wireframes: `assets/wireframes/`. Screenshots: `assets/screenshots/`. Coverage note: `VALIDATION.md`. Full report: `09-case-study/case-study-report.pdf`.
