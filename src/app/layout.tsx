import type { Metadata } from "next";
import { Inter, Geist_Mono, Pixelify_Sans } from "next/font/google";
import "./globals.css";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const pixel = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Capitol — accountability rooms for ambitious people",
  description:
    "a gamified productivity and accountability platform — build habits, complete goals, and grow through structured accountability rooms, xp systems, and leaderboards.",
  keywords: ["accountability", "goals", "network", "productivity", "community", "Capitol"],
  authors: [{ name: "Capitol" }],
  openGraph: {
    title: "Capitol — accountability rooms for ambitious people",
    description:
      "a gamified productivity and accountability platform — build habits, complete goals, and grow through structured accountability rooms, xp systems, and leaderboards.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Capitol — accountability rooms for ambitious people",
    description:
      "a gamified productivity and accountability platform — build habits, complete goals, and grow through structured accountability rooms, xp systems, and leaderboards.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${pixel.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
