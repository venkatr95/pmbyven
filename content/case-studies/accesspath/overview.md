# AccessPath — executive summary

**Portfolio concept, 22 October 2026.** Implemented in `03-NavAccessPath/` as a browser prototype and a design record. Not validated with participants. Not a navigation service.

**UVP:** Find routes that work for your mobility needs, not just the shortest route.

## Problem and audience

A short walk can hide stairs, a steep block, a missing curb ramp, or an undescribed entrance. People often learn that after they start. Some maps offer a wheelchair or step-free option. The gap this concept addresses is that those options still tend to return one filtered route without showing what was confirmed, what a person reported, and what is unknown.

**Primary audience:** people who need step-free travel or who need to limit stairs and steepness. Needs differ, so the product does not use one profile. **Secondary:** people planning for someone else, or for a stroller, luggage, or an injury. The job is to compare routes against those settings before leaving. A guarantee and turn-by-turn guidance are out of scope.

## Solution and journey

Settings are avoid stairs, prefer known curb ramps, and an optional grade limit. Presets — step-free, gentle, stroller or luggage, and custom — fill them and stay editable. They do not name a diagnosis.

Each route is labeled **Matches your preferences on confirmed data**, **Some details are unknown**, **Conflicts with your preferences**, or **No access preferences selected**. Unknown blocks a match when that setting is on. A community note cannot confirm a fact. Conflicting reports stay listed. The interface never says “fully accessible.”

On illustrative data, a step-free trip from Cal Anderson Park to Pike Place Market shows Madison gentle (about 2.0 mi, 48 min) as a match, Pike and Seneca (about 1.7 mi, 41 min) as unknown, and shorter Pine Street direct (about 1.2 mi, 26 min) as a conflict because of confirmed stairs and a 10% grade. The person can read each segment and file a report that stays **Pending review**.

## Design decisions

Preference fit is the default sort, and the failing route stays visible. The text list is complete. The map is a schematic, with solid, dashed, and double lines so status is not color alone. “Mark on the map” highlights a route and does not choose it. Pending is distinct from verified. Location is disclosed, and the prototype does not call the Geolocation API. Seattle is a pilot hypothesis because published sidewalk work (AccessMap, OS-CONNECT) exists there. The sample streets are invented and unlicensed.

## Implementation and validation

Must-have comparison, unknown handling, text detail, and local barrier reports work on sample trips. Saved preferences stay in this browser, so the signed-in part of FR-06 is unmet. FR-07 is one sample elevator notice, not a live feed. Empty, error, offline, and outside-pilot states do not invent a route.

**Checked on 22 October 2026:** 19 node tests, plus headless Chrome captures of 15 wireframe boards and 16 prototype states. Contrast was calculated, including a disabled-button correction from 3.88:1 to 10.24:1. No screen-reader pass was done.

No interviews and no usability sessions have been run. Maya Chen, Andre Brooks, and Priya Shah are hypothesis personas, not evidence. The PRD targets — 80% can set a preference and select a suitable route, 80% can distinguish confirmed, community-reported, and unknown, and fewer selection errors than a baseline — are criteria for a future study, not results. Competitor notes cover public pages for AccessMap, Google Maps, Citymapper, and Wheelmap, reviewed 22 October 2026. AXS Map, AccessNow, Apple Maps, and Ezymob were not fully verified.

**Main risks:** unknown may be read as “probably fine”; three settings may feel like a form; a schematic may not earn trust; some people want a simple yes. A pilot data-quality and safety review has not been done.

## Where to look

| Need | Path |
| --- | --- |
| Run the prototype | `03-NavAccessPath/README.md` — `npm test`, `npm start`, http://127.0.0.1:4175 |
| Analysis, research plan, flows | `01-product-analysis/`, `02-ux-research/`, `03-information-architecture/` |
| Wireframes and screenshots | `assets/wireframes/`, `assets/screenshots/` |
| Full report | `09-case-study/case-study-report.docx` and `case-study-report.pdf` |

There is no `00-project-brief/` folder and no Figma file. The PRD is `03-accesspath-inclusive-navigation.md` at the case-studies root.

## Next steps

1. Run the interview plan before treating any persona as evidence.
2. Run the five tasks in `08-usability-testing/test-scenarios.md` and file real notes.
3. Retest the match wording, “Mark on the map,” and pending versus verified.
4. Choose a pilot city and a data license only after that research.
5. Hold live routing, accounts, and transit alerts until a data-quality review exists.
