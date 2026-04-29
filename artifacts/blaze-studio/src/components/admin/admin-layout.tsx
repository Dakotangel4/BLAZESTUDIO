import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Inbox,
  LogOut,
  ExternalLink,
  Flame,
  FileText,
  FolderTree,
} from "lucide-react";
import { useAdminLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const NAV = [
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/blogs/categories", label: "Categories", icon: FolderTree },
];

function isNavActive(navHref: string, current: string): boolean {
  if (navHref === "/admin/blogs") {
    return (
      current === "/admin/blogs" ||
      (current.startsWith("/admin/blogs/") &&
        !current.startsWith("/admin/blogs/categories"))
    );
  }
  return current === navHref || current.startsWith(`${navHref}/`);
}

export default function AdminLayout({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const logout = useAdminLogout({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries();
        toast.success("Signed out");
        setLocation("/admin/login");
      },
      onError: () => toast.error("Could not sign out. Try again."),
    },
  });

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-slate-950 text-slate-200">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-500 text-white">
            <Flame className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">Blaze Studio</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400">
              Admin Console
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const active = isNavActive(item.href, location);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            View site
          </a>
          <button
            type="button"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            {logout.isPending ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">
                {title}
              </h1>
              {subtitle ? (
                <p className="text-xs sm:text-sm text-slate-500 truncate">
                  {subtitle}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              {actions}
              <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Admin
              </span>
            </div>
          </div>

          {/* Mobile nav */}
          <div className="md:hidden flex gap-1 overflow-x-auto px-3 pb-2">
            {NAV.map((item) => {
              const active = isNavActive(item.href, location);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs whitespace-nowrap ${
                    active
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1.5 text-xs text-slate-600 disabled:opacity-60"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
