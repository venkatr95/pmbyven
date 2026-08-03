import "@testing-library/jest-dom/vitest";
import React from "react";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// Next.js navigation mocks
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// next/link → plain anchor for tests
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => React.createElement("a", { href, ...props }, children),
}));

// Framer Motion → strip animation for stable tests
vi.mock("framer-motion", () => {
  const passthrough =
    (Tag: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ children, ...props }: any) => {
      const {
        initial: _i,
        animate: _a,
        exit: _e,
        transition: _t,
        whileInView: _w,
        whileHover: _h,
        whileTap: _p,
        viewport: _v,
        layoutId: _l,
        variants: _var,
        ...rest
      } = props;
      return React.createElement(Tag, rest, children);
    };

  return {
    motion: {
      div: passthrough("div"),
      header: passthrough("header"),
      section: passthrough("section"),
      article: passthrough("article"),
      span: passthrough("span"),
      p: passthrough("p"),
      nav: passthrough("nav"),
      button: passthrough("button"),
      a: passthrough("a"),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useScroll: () => ({ scrollY: { get: () => 0, on: () => () => {} } }),
    useMotionValueEvent: () => {},
    useInView: () => true,
  };
});

// ResizeObserver for Radix / cmdk
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

// matchMedia for reduced-motion checks
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// scrollIntoView
Element.prototype.scrollIntoView = vi.fn();
