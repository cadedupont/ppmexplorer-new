import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Copse, Merriweather_Sans } from "next/font/google";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import "./globals.css";

const copse = Copse({
  weight: "400",
  variable: "--font-copse",
  display: "swap",
  subsets: ["latin"],
});

const merriweather_sans = Merriweather_Sans({
  weight: "300",
  variable: "--font-merriweather-sans",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PPMExplorer",
  description:
    "AI-powered application for exploring and analyzing artwork discovered in Pompeii.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <html
      lang="en"
      className={`${copse.variable} ${merriweather_sans.variable}`}
    >
      <body>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
