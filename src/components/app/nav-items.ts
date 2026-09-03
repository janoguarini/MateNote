import { LayoutDashboard, Sparkles, Search, Bookmark, TrendingUp } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyze", label: "Analyze", icon: Sparkles },
  { href: "/research", label: "Research", icon: Search },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/trends", label: "Trends", icon: TrendingUp },
] as const;
