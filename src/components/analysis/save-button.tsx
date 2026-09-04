"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { track } from "@/lib/analytics";

export function SaveButton({
  analysisId,
  initiallySaved,
  isAuthenticated,
}: {
  analysisId: string;
  initiallySaved: boolean;
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [saved, setSaved] = React.useState(initiallySaved);
  const [loading, setLoading] = React.useState(false);

  async function handleSave() {
    if (!isAuthenticated) {
      router.push(`/login?next=/analysis/${analysisId}`);
      return;
    }

    setLoading(true);
    const res = saved
      ? await fetch(`/api/saved/${analysisId}`, { method: "DELETE" })
      : await fetch(`/api/analyses/${analysisId}/save`, { method: "POST" });
    setLoading(false);

    if (res.ok) {
      setSaved((prev) => !prev);
      if (!saved) track({ name: "analysis_saved", analysisId });
      toast({
        title: saved ? "Eliminado de guardados" : "Guardado en tu biblioteca",
        variant: "success",
      });
    } else {
      toast({ title: "Algo salió mal", variant: "error" });
    }
  }

  return (
    <Button variant={saved ? "secondary" : "outline"} onClick={handleSave} disabled={loading}>
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : saved ? (
        <BookmarkCheck className="size-4" />
      ) : (
        <Bookmark className="size-4" />
      )}
      {saved ? "Guardado" : "Guardar"}
    </Button>
  );
}
