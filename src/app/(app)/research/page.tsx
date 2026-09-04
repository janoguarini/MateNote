import type { Metadata } from "next";
import { ResearchSearch } from "@/components/app/research-search";

export const metadata: Metadata = { title: "Investigar" };

export default function ResearchPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          Investigá lo que funciona.
        </h1>
        <p className="mt-2 max-w-lg text-muted-foreground">
          Buscá creadores, temas o ideas de video, y después analizá lo que te llame la atención.
        </p>
      </div>
      <ResearchSearch />
    </div>
  );
}
