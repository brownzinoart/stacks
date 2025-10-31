import { Book } from "@/lib/mockData";
import BookCard from "./BookCard";

interface BookSectionProps {
  title: string;
  books: Book[];
  size?: "small" | "medium" | "large";
}

export default function BookSection({ title, books, size = "medium" }: BookSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="font-black text-xl uppercase tracking-tighter px-4 mb-4">
        {title}
      </h2>
      <div className="overflow-x-auto px-4">
        <div className="flex gap-4" style={{ width: "max-content" }}>
          {books.map((book) => (
            <BookCard key={book.id} book={book} size={size} />
          ))}
        </div>
      </div>
    </div>
  );
}
