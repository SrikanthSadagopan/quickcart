import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickCart Pricing",
  description: "Pricing engine assignment",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
