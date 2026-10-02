import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CivicFix",
  description: "Portal de reportes ciudadanos · Ayuntamiento de Maravatío",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
