import { mockBooksWithMetadata } from "@/lib/mockData";
import BookDetailClient from "./BookDetailClient";

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // Generate params for all books in mock data
  return mockBooksWithMetadata.map((book) => ({
    id: book.id,
  }));
}

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = params instanceof Promise ? null : params;
  if (!resolvedParams) {
    return <div>Loading...</div>;
  }
  return <BookDetailClient bookId={resolvedParams.id} />;
}
