"use client";

import { useState, useTransition } from "react";
import { themes, type ThemeId } from "@/lib/themes";
import { useThemeStore } from "@/store/theme";
import { toast } from "sonner";
import { saveFullThemeConfig } from "@/lib/actions/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminThemesPage() {
  const themeId = useThemeStore((s) => s.themeId);
  const setThemeId = useThemeStore((s) => s.setThemeId);
  const [accent, setAccent] = useState("#3b82f6");
  const [radius, setRadius] = useState("1rem");
  const [glass, setGlass] = useState("medium");
  const [anim, setAnim] = useState("normal");
  const [container, setContainer] = useState("1200px");
  const [fontHeading, setFontHeading] = useState("Instrument Serif");
  const [fontBody, setFontBody] = useState("Inter");
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Theme customizer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          No coding required — colors, type, glass, radius, animation speed.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setThemeId(t.id as ThemeId);
              toast.success(`${t.name} previewed`);
            }}
            className={`glass rounded-2xl p-5 text-left transition-all hover:shadow-lg hover:-translate-y-0.5 ${
              themeId === t.id ? "ring-2 ring-primary" : ""
            }`}
          >
            <div
              className="h-16 rounded-xl mb-4"
              style={{
                background: `linear-gradient(135deg, hsl(${t.vars["--gradient-from"]}), hsl(${t.vars["--gradient-to"]}))`,
              }}
            />
            <p className="font-medium">{t.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 grid sm:grid-cols-2 gap-4 max-w-2xl">
        <div className="space-y-2">
          <Label>Accent</Label>
          <Input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Border radius</Label>
          <Input value={radius} onChange={(e) => setRadius(e.target.value)} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Glass intensity</Label>
          <select
            value={glass}
            onChange={(e) => setGlass(e.target.value)}
            className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Animation speed</Label>
          <select
            value={anim}
            onChange={(e) => setAnim(e.target.value)}
            className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="slow">slow</option>
            <option value="normal">normal</option>
            <option value="fast">fast</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Heading font</Label>
          <Input value={fontHeading} onChange={(e) => setFontHeading(e.target.value)} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Body font</Label>
          <Input value={fontBody} onChange={(e) => setFontBody(e.target.value)} className="rounded-xl" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Container width</Label>
          <Input value={container} onChange={(e) => setContainer(e.target.value)} className="rounded-xl" />
        </div>
        <Button
          variant="cta"
          className="sm:col-span-2"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await saveFullThemeConfig({
                activeTheme: themeId,
                accent,
                radius,
                glassIntensity: glass,
                animationSpeed: anim,
                containerWidth: container,
                fontHeading,
                fontBody,
              });
              document.documentElement.style.setProperty("--radius", radius);
              toast.success("Theme config persisted");
            })
          }
        >
          Save theme config
        </Button>
      </div>
    </div>
  );
}
