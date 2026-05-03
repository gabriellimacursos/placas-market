import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "PlacasTech — Marketplace de Placas de A/C",
  description: "Compre e venda placas eletrônicas de ar-condicionado. Evaporadora, condensadora, inversora e mais.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-gray-50 antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
