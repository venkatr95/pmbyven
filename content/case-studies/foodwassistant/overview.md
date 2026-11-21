# FreshLoop

**Know what to cook before your groceries go to waste.**

FreshLoop is a mobile-first portfolio prototype. A person logs food already at home, sees which dates they entered are soon, and opens a recipe that shows what the pantry covers. The shopping list subtracts a quantity only when the units compare. The product does not decide whether food is safe.

**Status:** Design and prototype are complete for review. No interviews or usability sessions have been run. Personas, journey pains, and the PRD success targets are hypotheses. The timeline is proposed, not a staffed engagement. Role: product design, UX writing, design system, and front-end prototype.

## Problem and audience

Households can forget food and buy it again. Many meal tools start from a dish. The hypothesis is that the hard moment is the decision: which ingredient needs attention, and what can be cooked without pretending a quantity is known.

**Primary hypothesis:** people who plan meals and shop for a household. **Secondary hypothesis:** students and budget-conscious cooks with a smaller pantry. These are proto-personas in `02-ux-research/personas.md`, not findings.

## Solution and primary journey

Inventory first. Welcome states the promise and the limit. Pantry leads with a count of Use soon. Cook opens a sample recipe with Have, Short, Check, Missing, Staple, or Optional on every ingredient. Review names what would be bought and what was left off. The person then keeps a shopping list or marks the meal cooked, with undo.

On the tested sample clock (22 October 2026, 3-day window): four items are Use soon, yogurt is Date passed, and ginger is Opened. The spinach skillet is covered. Yogurt stays on the list because a piece is not grams. Two dinners ask for one more lemon and one more garlic, and not for spinach.

## Design decisions

- Best-before and use-by dates inside the person’s window are Use soon. Opened-on is never an expiry. There is no shelf-life table and no keep-or-discard verdict.
- A quantity is subtracted only when the units compare. A blank amount or a mismatched unit stays on the list. A plan subtracts the pantry once.
- Salt, pepper, and water can be left off. The switch is visible. Olive oil is not assumed.
- Diet filters hide listed flags, including optional ingredients, and say they are not an allergen or medical judgment.
- Reminders are off until allowed, and this prototype cannot notify after the page closes.
- One kitchen. Data stays in `localStorage` under `freshloop.v1`. It is not encrypted.

Green is the action color, not a “safe” color. Statuses are words plus color. There is no Figma file. Sixteen annotated SVG wireframes are the low-fidelity set.

## What is implemented

The Vite and TypeScript app in `prototype/` covers welcome, pantry, add and edit, use soon, cook, recipe, review, shop, a four-day plan, cooked update, settings, recovery, and an offline banner. Quick add is a name. Batch edit can move or remove whole items. Partial amounts are edited one item at a time.

Simulated, and labeled: a fictional sample kitchen, seven original recipes, and two barcodes that fill a form but do not save themselves. Receipt scan is an unavailable dialog, not a camera. Reminder permission is simulated.

Not built: a licensed recipe API, a live barcode database, shared editing, retailer checkout, image recognition, and background push.

## Evidence

Competitor and standards pages were read on 22 October 2026. Notes are in `01-product-analysis/competitive-analysis.md`. NoWaste, Samsung Food, and The Pantry already describe inventory and lists. A waste percentage on a competitor homepage is that company’s claim, not a FreshLoop result. FSIS dating guidance is linked, not applied.

`VALIDATION.md` records 17 passing Vitest tests (12 logic, 5 flow), a typecheck, and a production build. A later run in the same build session also passed. Those tests are not user evidence. Screenshots in `assets/screenshots/` load a URL. They do not click, and they are not usability results. The findings template is empty.

## Metrics, risks, and limits

The PRD targets of 75 percent and 70 percent are criteria for a future test. They are not results. Self-reported discarded-food frequency has not been measured. No business impact is claimed.

The highest-risk assumption is that someone will keep a pantry current if the first add is only a name. Regional date labels, a licensed recipe source, and shared-kitchen conflict rules remain open.

## Where to look

| Path | Contents |
| --- | --- |
| `01-product-analysis/` | Brief, competitors, positioning, risks, metrics |
| `02-ux-research/` | Protocols, hypotheses, empty findings |
| `03-information-architecture/` | Sitemap, flows, traceability |
| `04-wireframes/` and `assets/wireframes/` | Specs and 16 SVGs |
| `05-ui-design-system/` and `06-high-fidelity-ui/` | Tokens, components, screen specs |
| `prototype/` | Working app and tests |
| `08-usability-testing/` | Plan and empty findings |
| `09-case-study/` | Narrative and slide outline |
| `case-study-report.docx` and `.pdf` | This review’s full report |
| `README.md` and `VALIDATION.md` | How to run the prototype, and PRD coverage |

`00-project-brief/` does not exist. The brief is the PRD plus `01-product-analysis/product-brief.md`.

## Next steps

1. Interview 5–8 people with `02-ux-research/interview-guide.md` before treating logging as a real habit.
2. Run the five tasks in `08-usability-testing/`. Stop if a date is heard as a safety verdict.
3. Do not add a recipe license or a live barcode database until those sessions say the loop is worth feeding.
4. Run a keyboard and screen-reader pass, including a narrow phone width, before any public pilot.
5. Replace `localStorage` before any real household data is stored.
