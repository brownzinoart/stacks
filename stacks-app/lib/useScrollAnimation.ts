"use client";

import { useEffect, useRef } from "react";

export function useScrollAnimation(direction: "up" | "down" = "up") {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.remove("scroll-animate-initial");
            element.classList.add(`scroll-animate-${direction}`);
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 }
    );

    element.classList.add("scroll-animate-initial");
    observer.observe(element);

    return () => observer.disconnect();
  }, [direction]);

  return ref;
}
