import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  BookOpen,
  Users,
  Image,
  Mail,
  Settings,
  Palette,
  BarChart3,
  Menu,
  FileStack,
  History,
  File,
  Home,
  Search,
  Database,
  Library,
  Shield,
} from "lucide-react";
import { isAdminAuthenticated } from "@/lib/admin";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminLogout } from "@/components/admin/admin-logout";
import { Logo } from "@/components/brand/logo";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/posts/new", label: "New Post", icon: FileStack },
  { href: "/admin/pages", label: "Pages", icon: File },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/series", label: "Series", icon: BookOpen },
  { href: "/admin/collections", label: "Collections", icon: Library },
  { href: "/admin/authors", label: "Authors", icon: Users },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/themes", label: "Themes", icon: Palette },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/menus", label: "Menus", icon: Menu },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/revisions", label: "Revisions", icon: History },
  { href: "/admin/backups", label: "Backups", icon: Database },
  { href: "/admin/announcements", label: "Announcements", icon: Shield },
  { href: "/admin/notes", label: "Pinned notes", icon: FileStack },
  { href: "/admin/integrations", label: "Integrations", icon: Mail },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border/50 bg-card/50">
        <div className="p-5 border-b border-border/50">
          <Logo
            markClassName="h-8 w-8 shadow-none"
            wordmarkClassName="text-lg leading-none"
          />
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1.5 pl-10">
            Admin
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border/50 space-y-2">
          <Link
            href="/"
            className="block text-center text-xs text-muted-foreground hover:text-foreground py-2"
          >
            ← View site
          </Link>
          <AdminLogout />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-40 glass-strong border-b border-border/50 px-4 py-3 flex items-center justify-between">
          <span className="font-serif text-lg">Admin</span>
          <div className="flex gap-2 overflow-x-auto">
            {nav.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs px-2 py-1 rounded-full bg-secondary whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
