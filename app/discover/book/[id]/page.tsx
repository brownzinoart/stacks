import { mockBooksWithMetadata } from "@/lib/mockData";
import BookDetailClient from "./BookDetailClient";

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // Generate params for all books in mock data
  return mockBooksWithMetadata.map((book) => ({
    id: book.id,
  }));
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  return <BookDetailClient bookId={params.id} />;
}
