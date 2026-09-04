import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/app/logout-button";

export const metadata: Metadata = { title: "Configuración" };

export default async function SettingsPage() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "Desconocido";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight">Configuración</h1>
        <p className="mt-1 text-muted-foreground">Administrá tu cuenta.</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Cuenta</CardTitle>
          <CardDescription>Tu perfil de MateNote.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback>{email.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{email}</p>
              <p className="text-xs text-muted-foreground">
                Te uniste el{" "}
                {user?.created_at ? new Date(user.created_at).toLocaleDateString("es-AR") : "—"}
              </p>
            </div>
          </div>
          <LogoutButton />
        </CardContent>
      </Card>
    </div>
  );
}
