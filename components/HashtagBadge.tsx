interface HashtagBadgeProps {
  hashtag: string; // With or without # prefix
  onClick?: (hashtag: string) => void;
}

export default function HashtagBadge({ hashtag, onClick }: HashtagBadgeProps) {
  // Remove # prefix if present for the onClick handler
  const cleanHashtag = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
  // Display with # prefix
  const displayText = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;

  return (
    <button
      onClick={() => onClick?.(cleanHashtag)}
      className="bg-gradient-info text-white px-3 py-1 rounded-xl border-[3px] border-black dark:border-white shadow-brutal-badge font-black text-sm uppercase"
    >
      {displayText}
    </button>
  );
}
