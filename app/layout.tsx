import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Segunda — Infraestructura de confianza",
  description:
    "Construye confianza financiera, sin deuda. Reputación portable y verificable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} min-h-screen antialiased font-sans text-[var(--foreground)] bg-[var(--background)]`}>
        {children}
      </body>
    </html>
  );
}
