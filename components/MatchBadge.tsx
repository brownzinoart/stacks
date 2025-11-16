interface MatchBadgeProps {
  score: number;
}

export default function MatchBadge({ score }: MatchBadgeProps) {
  const getGradient = (score: number) => {
    if (score >= 90) return "bg-gradient-success";
    if (score >= 75) return "bg-gradient-info";
    return "bg-gradient-secondary";
  };

  return (
    <div
      className={`${getGradient(score)} px-3 py-1 border-[3px] border-black dark:border-white shadow-brutal-badge rounded-xl text-center`}
    >
      <p className="text-xs font-black text-white">
        {score}% MATCH
      </p>
    </div>
  );
}
