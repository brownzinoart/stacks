"use client";

interface VibeChipsProps {
  onVibeClick: (vibe: string) => void;
}

const VIBE_TAGS = [
  "Dark Academia",
  "Cozy Fantasy",
  "Romantasy",
  "Enemies to Lovers",
  "Found Family",
  "Slow Burn",
  "Sapphic",
  "Spicy 🌶️",
];

export default function VibeChips({ onVibeClick }: VibeChipsProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 px-4 py-2" style={{ width: "max-content" }}>
        {VIBE_TAGS.map((vibe) => (
          <button
            key={vibe}
            onClick={() => onVibeClick(vibe)}
            className="badge-brutal hover:shadow-brutal whitespace-nowrap"
          >
            {vibe}
          </button>
        ))}
      </div>
    </div>
  );
}
