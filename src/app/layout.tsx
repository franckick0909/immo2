
import Header from "@/components/ui/layout/header";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Immo2",
  description: "Application de gestion immobilière",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
            <Header />
            {children}
        <Toaster />
      </body>
    </html>
  );
}
