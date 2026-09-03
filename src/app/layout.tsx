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
    default: "MateNote — Turn YouTube Videos Into Creator Insights",
    template: "%s · MateNote",
  },
  description:
    "Analyze YouTube videos, extract transcripts, discover hooks, understand content structure and generate new ideas with AI.",
  openGraph: {
    title: "MateNote — Turn YouTube Videos Into Creator Insights",
    description:
      "Analyze YouTube videos, extract transcripts, discover hooks, understand content structure and generate new ideas with AI.",
    siteName: "MateNote",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MateNote — Turn YouTube Videos Into Creator Insights",
    description:
      "Analyze YouTube videos, extract transcripts, discover hooks, understand content structure and generate new ideas with AI.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrument.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
