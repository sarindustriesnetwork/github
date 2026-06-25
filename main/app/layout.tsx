import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { BRAND } from "@/lib/branding";

export const metadata: Metadata = {
  title: `${BRAND.name} Control Center`,
  description: BRAND.description,
  authors: [{ name: BRAND.owner }],
  creator: BRAND.name,
  publisher: BRAND.name
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
