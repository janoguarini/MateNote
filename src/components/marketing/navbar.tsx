import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#how-it-works" className="transition-colors hover:text-foreground">
            Cómo funciona
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            Funciones
          </a>
          <a href="#research" className="transition-colors hover:text-foreground">
            Investigación
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild size="sm">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Empezar</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
