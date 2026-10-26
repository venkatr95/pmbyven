# Rewear — executive summary

**Digital wardrobe and outfit planner.** Portfolio concept in `02-DigitalWarderobe/`. The prototype is implemented. It has not been tested with participants, and no business result is claimed.

**UVP:** Create more outfits from clothes you already own.

## Problem and audience

The problem is a hypothesis. People may own clothes they rarely wear because items are hard to remember and coordinate, so buying can feel easier than combining what they already have. The primary audience is people who want more use from an existing wardrobe and less time deciding what to wear. The secondary audience is people packing short trips. The product must not shame consumption or body shape.

## Solution

Rewear is a private, mobile-first catalogue. A person adds an item with or without a photo, searches and filters, and saves an outfit for an occasion and a weather preference they choose. Suggestions are tag rules that explain the match. They can be saved or dismissed. A trip list shows each item once, even when outfits share it.

## Primary journey

Open Rewear. Start from a labeled sample of 12 items or an empty wardrobe. Add or find clothes. Save an outfit. Optionally pack two outfits so a shared piece is one line.

## Design decisions

The closet stays private: no feed, resale, body scoring, purchase tips, or environmental-impact claims. Weather is a choice, not GPS. A photo is an attachment, not a scan, and manual entry is on the same form. Cost per wear appears only when a price and at least one wear exist. Packing is built even though the requirements table marks FR-06 as Should, because the scope list, core flow, and release checklist include it. A dress can be saved alone. Any other outfit needs at least two items.

The visual direction is “Morning paper”: warm paper, ink text, Fraunces and Figtree. Checked text pairs meet WCAG 2.2 AA contrast. Ink on paper is 15.30:1. That calculation is not a certification.

## What is implemented

The prototype is Vite and TypeScript. Data stays in this browser (`localStorage`, key `rewear.v1`). Catalogue, search, outfits, explained suggestions, wears, cost per wear, and packing run in the client. The sample wardrobe is labeled illustrative. Reviewer tools can preview a failed upload without a real file. There is no weather API, image recognition, account, or server.

## Research and validation

Whering, Stylebook, Acloset, Indyx, and Cladwell were reviewed from public pages on 22 October 2026. No interviews were run. Proto-personas Maya and Sam are hypotheses. A five-task usability plan exists. The findings template is empty. On 22 October 2026, 18 automated tests passed, the production build succeeded, and a headless Edge click-through covered the core path. The PRD targets — 70 percent add five items, 80 percent find or generate an outfit, median under three minutes — were not measured.

## Risks and limitations

The highest-risk assumption is that people will tag color, season, and dressiness. Storage is one browser, not a production deletion design. Packing lines do not say when an item is archived. Two suggestions for the same occasion can share a name. There is no laundry state. Changing currency changes the symbol only.

## Success metrics

The north star, not yet measured, is a saved outfit the person would wear, made from clothes they own. Weekly saves and repeat use are post-launch indicators only.

## Where to look

Narrative: `09-case-study/case-study.md`. Checks: `VALIDATION.md`. Wireframes: `assets/wireframes/wireframes.html`. App: `prototype/`.

## Next steps

1. Run the interview guide before treating the personas as users.
2. Run the five usability tasks and record completion, not the PRD percentages.
3. Change scope only from those results. Leave laundry and a weather API until the evidence asks for them.
4. If suggestions are distrusted, keep the manual builder and revise the rules.
5. Do not design an account until deletion and sync are specified.
