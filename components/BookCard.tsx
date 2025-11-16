import { Book } from "@/lib/mockData";

interface BookCardProps {
  book: Book;
  size?: "small" | "medium" | "large";
}

export default function BookCard({ book, size = "medium" }: BookCardProps) {
  const sizeClasses = {
    small: "w-32",
    medium: "w-40",
    large: "w-48",
  };

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0`}>
      {/* Book Cover */}
      <div className="relative w-full aspect-[2/3] bg-gradient-secondary border-[5px] border-light-border dark:border-dark-border shadow-brutal rounded-[20px] mb-3 overflow-hidden">
        <img
          src={book.cover}
          alt={`${book.title} by ${book.author}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Cascade: Try Google Books fallback
            const googleCover = book.googleBooksCoverUrl;
            if (googleCover && e.currentTarget.src !== googleCover) {
              e.currentTarget.src = googleCover;
            } else {
              // Final fallback: hide img, show placeholder
              e.currentTarget.style.display = 'none';
              const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }
          }}
        />
        {/* Styled placeholder (hidden by default) */}
        <div className="absolute inset-0 bg-gradient-accent flex items-center justify-center text-4xl" style={{ display: 'none' }}>
          📚
        </div>

        {/* Genre Badge Overlay */}
        {book.genres.length > 0 && (
          <div className="absolute top-2 right-2 bg-black/80 border-[3px] border-white px-2 py-1 z-10 rounded-lg">
            <p className="text-white font-black text-xs uppercase">
              {book.genres[0]}
            </p>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div>
        <h3 className="font-black text-sm uppercase tracking-tight line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 line-clamp-1">
          {book.author}
        </p>
      </div>
    </div>
  );
}
