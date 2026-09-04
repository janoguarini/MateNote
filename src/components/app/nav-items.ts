import { LayoutDashboard, Sparkles, Search, Bookmark, TrendingUp } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/analyze", label: "Analizar", icon: Sparkles },
  { href: "/research", label: "Investigar", icon: Search },
  { href: "/saved", label: "Guardados", icon: Bookmark },
  { href: "/trends", label: "Tendencias", icon: TrendingUp },
] as const;
