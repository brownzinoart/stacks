"use client";

interface HeroDividerProps {
  title: string;
  subtitle: string;
  gradient: "primary" | "accent" | "success" | "info";
}

export default function HeroDivider({ title, subtitle, gradient }: HeroDividerProps) {
  const gradientClasses = {
    primary: "bg-gradient-primary",
    accent: "bg-gradient-accent",
    success: "bg-gradient-success",
    info: "bg-gradient-info",
  };

  return (
    <div
      className={`px-4 py-6 md:px-8 md:py-10 ${gradientClasses[gradient]} border-4 md:border-[5px] border-black dark:border-white rounded-xl shadow-brutal mb-6 text-center`}
    >
      <h3
        className="text-2xl md:text-4xl font-black uppercase mb-2 text-white"
        style={{ textShadow: "2px 2px 0 #000" }}
      >
        {title}
      </h3>
      <p
        className="text-base md:text-xl font-bold text-white"
        style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.3)" }}
      >
        {subtitle}
      </p>
    </div>
  );
}
