import type { Metadata } from "next";
import { Copse, Merriweather_Sans } from "next/font/google";
import "./globals.css";

const copse = Copse({
  weight: "400",
  variable: "--font-copse",
  display: "swap",
  subsets: ["latin"]
});

const merriweather_sans = Merriweather_Sans({
  weight: "300",
  variable: "--font-merriweather-sans",
  display: "swap",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "PPMExplorer",
  description: "AI-powered application for exploring and analyzing artwork discovered in Pompeii."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${copse.variable} ${merriweather_sans.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
