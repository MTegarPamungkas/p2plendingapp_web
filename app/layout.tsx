import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ClientProviders } from "@/components/clientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "P2P Lending for SMEs | Blockchain Credit Scoring",
  description:
    "P2P lending platform for SMEs with blockchain-based credit scoring using Hyperledger Fabric",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-background font-sans antialiased`}
      >
        <ClientProviders>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
