interface MatchBadgeProps {
  score: number;
}

export default function MatchBadge({ score }: MatchBadgeProps) {
  const getBadgeStyle = (score: number) => {
    if (score >= 90)
      return {
        bg: "bg-riso-green",
        label: "PERFECT",
        emoji: "✨"
      };
    if (score >= 75)
      return {
        bg: "bg-riso-blue",
        label: "MATCH",
        emoji: "💯"
      };
    if (score >= 60)
      return {
        bg: "bg-riso-orange",
        label: "MATCH",
        emoji: "🔥"
      };
    return {
      bg: "bg-riso-purple",
      label: "MAYBE",
      emoji: "🤔"
    };
  };

  const style = getBadgeStyle(score);

  return (
    <div
      className={`${style.bg} px-3 py-1.5 border-[3px] border-light-border dark:border-dark-border shadow-brutal-badge rounded-xl text-center inline-block transition-all hover:scale-105 hover:-rotate-1 hover:shadow-[-4px_4px_0_0_rgb(var(--shadow-color))] cursor-default`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{style.emoji}</span>
        <p className="font-display text-xs font-black text-white uppercase tracking-tight">
          {score}% {style.label}
        </p>
      </div>
    </div>
  );
}
