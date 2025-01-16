import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Copse, Figtree } from "next/font/google";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const copse = Copse({
  weight: "400",
  variable: "--font-copse",
  display: "swap",
  subsets: ["latin"],
});

const figtree = Figtree({
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-figtree",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PPMExplorer",
  description:
    "AI-powered application for exploring and analyzing artwork discovered in Pompeii.",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <html
      lang="en"
      className={`${copse.variable} ${figtree.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main>
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
