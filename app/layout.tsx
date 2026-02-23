import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Segunda — MVP",
  description: "Emisión y verificación de certificados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased bg-[var(--beige)] text-[var(--black)]">
        {children}
      </body>
    </html>
  );
}
