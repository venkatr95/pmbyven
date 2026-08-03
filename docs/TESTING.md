# Testing guide

pmbyven uses **Vitest** + **React Testing Library** for unit and component tests.

## Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Watch mode (local development) |
| `npm run test:run` | Single run |
| `npm run test:ci` | CI run with coverage + JUnit-friendly output |
| `npm run test:coverage` | Coverage report (`coverage/`) |
| `npm run test:ui` | Vitest UI (optional) |

## Stack

- **Vitest** — runner, assertions, mocks  
- **jsdom** — browser environment  
- **@testing-library/react** — component rendering  
- **@testing-library/user-event** — realistic interactions  
- **@testing-library/jest-dom** — DOM matchers (`toBeInTheDocument`, …)  

Config: `vitest.config.ts`  
Setup: `src/test/setup.ts`  
Helpers: `src/test/test-utils.tsx` (`renderWithProviders`)

## What’s covered

### Utilities & domain

| File | Focus |
|------|--------|
| `src/lib/utils.test.ts` | `cn`, dates, numbers, slugify, reading time, excerpts |
| `src/lib/themes.test.ts` | 8 themes, CSS vars, `getTheme` fallback |
| `src/lib/mdx.test.ts` | `extractHeadings` for TOC |
| `src/lib/admin.test.ts` | Admin secret + cookie helpers |
| `src/store/reader.test.ts` | Bookmarks, streak, font size, width |
| `src/store/theme.test.ts` | Theme id persistence API |

### UI primitives

| File | Focus |
|------|--------|
| `button.test.tsx` | Variants, sizes, disabled, `asChild` |
| `badge.test.tsx` | Variants |
| `input.test.tsx` | Typing, disabled, onChange |
| `card.test.tsx` | Composed layout |

### Widgets / features

| File | Focus |
|------|--------|
| `post-card.test.tsx` | Default / compact / horizontal cards |
| `newsletter-form.test.tsx` | Subscribe success & error paths |
| `section.test.tsx` | Home section chrome + links |
| `hero.test.tsx` | Featured hero vs empty state |
| `toc.test.tsx` | Contents list, collapse, scroll |
| `reading-controls.test.tsx` | Progress bar, width, bookmark, copy link |
| `article-sidebar.test.tsx` | Author, related, tags, series |
| `command-menu.test.tsx` | Search palette open + results |
| `admin-login.test.tsx` | Secret gate success/failure |

## Writing new tests

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { MyWidget } from "./my-widget";

describe("MyWidget", () => {
  it("renders", () => {
    render(<MyWidget title="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Conventions

1. Prefer **user-centric** queries: `getByRole`, `getByLabelText`, `getByText`.  
2. Mock **Server Actions** and **fetch** at the boundary — don’t hit a real DB in unit tests.  
3. Reset Zustand stores in `beforeEach` when testing client state.  
4. Framer Motion and `next/link` / `next/navigation` are mocked globally in `setup.ts`.  
5. Co-locate tests: `Component.tsx` → `Component.test.tsx`.

### Mocking a Server Action

```ts
vi.mock("@/lib/actions/newsletter", () => ({
  subscribeNewsletter: vi.fn(),
}));
```

## Coverage

CI uploads `coverage/` as an artifact. Thresholds (see `vitest.config.ts`):

- lines / statements / functions ≥ 50%  
- branches ≥ 40%  

Raise thresholds as the suite grows. Coverage includes `src/components`, `src/lib`, `src/store` (excludes generated Prisma client).

## CI integration

On every PR and push to `main`, GitHub Actions runs:

1. `npm ci`  
2. `prisma generate`  
3. `npm run lint`  
4. `npm run typecheck`  
5. `npm run test:ci`  
6. `npm run build` (separate job)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deploy gates.

## Out of scope (for now)

- Full E2E (Playwright) — add later with `playwright.config.ts` against `npm run start`  
- Visual regression  
- Load testing  

Suggested next step: Playwright smoke for `/`, `/blog`, `/admin` login, and newsletter submit.
