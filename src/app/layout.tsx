import type { Metadata } from 'next';
import { Copse, Figtree } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { ThemeProvider } from '@/components/theme-provider';
import NavBar from '@/components/ui/navbar';
import ReactQueryProvider from '@/components/react-query-provider';

import './globals.css';
import React, { Suspense } from 'react';

const copse = Copse({
  weight: '400',
  variable: '--font-copse',
  display: 'swap',
  subsets: ['latin'],
});

const figtree = Figtree({
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-figtree',
  display: 'swap',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PPMExplorer',
  description: 'AI-powered application for exploring and analyzing artwork discovered in Pompeii.',
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className={`${copse.variable} ${figtree.variable}`}>
      <body>
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NavBar />
            <main className="mx-auto flex max-w-screen-2xl items-center justify-center px-4 md:flex md:px-8">
              <Suspense fallback={<div>Loading...</div>}>
                {children}
                <SpeedInsights />
              </Suspense>
            </main>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
