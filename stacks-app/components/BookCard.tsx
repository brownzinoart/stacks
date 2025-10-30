import Image from "next/image";
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
      <div className="relative w-full aspect-[2/3] bg-gradient-secondary border-4 border-black dark:border-white shadow-brutal rounded-[20px] mb-3 overflow-hidden">
        <Image
          src={book.cover}
          alt={`${book.title} by ${book.author}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 160px, 192px"
        />

        {/* Genre Badge Overlay */}
        {book.genres.length > 0 && (
          <div className="absolute top-2 right-2 bg-black/80 border-3 border-white px-2 py-1 z-10 rounded-lg">
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
