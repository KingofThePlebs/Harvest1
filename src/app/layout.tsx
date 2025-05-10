import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Changed from Geist to Inter as an example of clean font
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // Using --font-sans for Tailwind compatibility
});

export const metadata: Metadata = {
  title: 'Harvest Clicker',
  description: 'A simple farming game by Firebase Studio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
