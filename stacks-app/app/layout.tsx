import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Stacks - Your Reading Community",
  description: "Share your book stacks, discover new reads, pace your reading",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="antialiased">
        <main className="min-h-screen pb-nav">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
