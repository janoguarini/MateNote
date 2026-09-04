import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row sm:px-8">
        <Logo />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} MateNote. Hecho para creadores.
        </p>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link href="/login" className="transition-colors hover:text-foreground">
            Iniciar sesión
          </Link>
          <Link href="/signup" className="transition-colors hover:text-foreground">
            Registrarse
          </Link>
        </div>
      </div>
    </footer>
  );
}
