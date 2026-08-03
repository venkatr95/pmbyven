"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Search,
  Menu,
  X,
  Palette,
  Settings,
  Archive,
  BookOpen,
  Tag,
  Layers,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThemeStore } from "@/store/theme";
import { themes, type ThemeId } from "@/lib/themes";
import { CommandMenu } from "@/components/search/command-menu";

const navLinks = [
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/categories", label: "Categories", icon: Layers },
  { href: "/topics", label: "Topics", icon: Tag },
  { href: "/collections", label: "Collections", icon: Layers },
  { href: "/archive", label: "Archive", icon: Archive },
  { href: "/reading-list", label: "Reading list", icon: BookOpen },
  { href: "/about", label: "About", icon: Info },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const setThemeId = useThemeStore((s) => s.setThemeId);
  const themeId = useThemeStore((s) => s.themeId);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 20);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      document.documentElement.style.setProperty("--mobile-nav-push", "0px");
      return;
    }
    const el = mobileMenuRef.current;
    if (!el) return;
    const update = () =>
      document.documentElement.style.setProperty(
        "--mobile-nav-push",
        `${el.offsetHeight}px`
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [mobileOpen]);

  useEffect(() => {
    return () => {
      document.documentElement.style.setProperty("--mobile-nav-push", "0px");
    };
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <motion.header
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "py-2" : "py-4"
        )}
        style={{ top: "var(--announcement-height, 0px)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav
            className={cn(
              "flex items-center justify-between rounded-full px-4 sm:px-6 transition-all duration-300",
              scrolled
                ? "glass-strong h-14 shadow-lg"
                : "glass h-16"
            )}
          >
            <Link href="/" className="group">
              <Logo
                className="transition-transform group-hover:opacity-95"
                markClassName="group-hover:scale-105 transition-transform"
                wordmarkClassName={cn(
                  "transition-all duration-300",
                  scrolled ? "text-xl" : "text-2xl"
                )}
              />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 rounded-full text-sm font-medium transition-colors",
                    pathname === link.href || pathname?.startsWith(link.href + "/")
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="text-muted-foreground"
              >
                <Search className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Themes" className="text-muted-foreground">
                    <Palette className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Themes</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {themes.map((t) => (
                    <DropdownMenuItem
                      key={t.id}
                      onClick={() => setThemeId(t.id as ThemeId)}
                      className={cn(themeId === t.id && "bg-secondary")}
                    >
                      <span
                        className="mr-2 h-3 w-3 rounded-full border border-border"
                        style={{
                          background: `linear-gradient(135deg, hsl(${t.vars["--gradient-from"]}), hsl(${t.vars["--gradient-to"]}))`,
                        }}
                      />
                      {t.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/admin" className="hidden sm:block">
                <Button variant="ghost" size="icon-sm" aria-label="Admin" className="text-muted-foreground">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/#newsletter" className="hidden sm:block ml-1">
                <Button size="sm" variant="cta">
                  Subscribe
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon-sm"
                className="lg:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </nav>

          {mobileOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 glass-strong rounded-2xl p-4 lg:hidden"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-colors",
                      pathname === link.href
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/60"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/#newsletter"
                  className="mt-2 flex items-center justify-center rounded-full bg-primary text-primary-foreground px-4 py-3 text-xs font-medium"
                >
                  Subscribe
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      <CommandMenu open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
