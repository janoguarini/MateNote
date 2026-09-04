import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://matenote.app"),
  title: {
    default: "MateNote — Convertí videos de YouTube en insights para creadores",
    template: "%s · MateNote",
  },
  description:
    "Analizá videos de YouTube, extraé transcripciones, descubrí hooks, entendé la estructura del contenido y generá nuevas ideas con IA.",
  openGraph: {
    title: "MateNote — Convertí videos de YouTube en insights para creadores",
    description:
      "Analizá videos de YouTube, extraé transcripciones, descubrí hooks, entendé la estructura del contenido y generá nuevas ideas con IA.",
    siteName: "MateNote",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MateNote — Convertí videos de YouTube en insights para creadores",
    description:
      "Analizá videos de YouTube, extraé transcripciones, descubrí hooks, entendé la estructura del contenido y generá nuevas ideas con IA.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${instrument.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
