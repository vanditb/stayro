import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Stayro | Direct-booking websites for short-term rentals",
    template: "%s | Stayro",
  },
  description:
    "Launch a beautiful direct-booking website for your rental in minutes with Stayro.",
  openGraph: {
    title: "Stayro",
    description:
      "AI-powered direct-booking websites for short-term rental hosts.",
    siteName: "Stayro",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
