import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";
import { HeaderWithWallet } from "@/components/HeaderWithWallet";

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
      <body className="min-h-screen flex flex-col antialiased bg-[var(--beige)] text-[var(--black)]">
        <WalletProvider>
          <HeaderWithWallet />
          <div className="flex-1 flex flex-col">{children}</div>
        </WalletProvider>
      </body>
    </html>
  );
}
