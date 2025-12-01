import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

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
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Force light mode - remove dark class if present
                if (document.documentElement.classList.contains('dark')) {
                  document.documentElement.classList.remove('dark');
                }
                // Ensure light class is present
                document.documentElement.classList.add('light');
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
