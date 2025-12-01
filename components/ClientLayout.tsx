"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isIntroPage = pathname === "/intro";

  return (
    <>
      <main className={`min-h-screen ${isIntroPage ? "" : "pb-nav"}`}>
        {children}
      </main>
      {!isIntroPage && <BottomNav />}
    </>
  );
}

