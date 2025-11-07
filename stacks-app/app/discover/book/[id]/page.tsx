"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { X, ExternalLink } from "lucide-react";
import { getMockBookDetail, BookDetail } from "@/lib/mockData";
import { getLibraryById, getLibraryCatalogUrl, Library } from "@/lib/libraryDatabase";

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<BookDetail | null>(null);
  const [userLibrary, setUserLibrary] = useState<Library | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API calls
    const bookDetail = getMockBookDetail(bookId);
    setBook(bookDetail);

    // Load user's library preference from localStorage
    const savedLibraryId = localStorage.getItem("userLibraryId");
    if (savedLibraryId) {
      const library = getLibraryById(savedLibraryId);
      if (library) {
        setUserLibrary(library);
      }
    }
  }, [bookId]);

  if (!book) {
    return (
      <div className="fixed inset-0 bg-light-text/80 dark:bg-dark-text/80 flex items-center justify-center z-[1000]">
        <p className="text-white font-semibold">Loading...</p>
      </div>
    );
  }

  const handleLibraryClick = () => {
    if (userLibrary && book.isbn) {
      const catalogUrl = getLibraryCatalogUrl(userLibrary, book.isbn, book.title);
      window.open(catalogUrl, "_blank");
    } else {
      // Redirect to settings if no library is set
      alert("Please set up your library in Settings");
      router.push("/settings");
    }
  };

  const handleBookshopClick = () => {
    // TODO: Use Bookshop.org affiliate link
    const bookshopUrl = `https://bookshop.org/search?keywords=${encodeURIComponent(book.isbn || book.title)}`;
    window.open(bookshopUrl, "_blank");
  };

  return (
    <div
      className="fixed inset-0 bg-light-text/80 dark:bg-dark-text/80 flex items-center justify-center z-[1000] p-5 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) router.back();
      }}
    >
      {/* Modal */}
      <div className="bg-light-secondary dark:bg-dark-secondary border-[5px] border-light-border dark:border-dark-border rounded-[20px] shadow-brutal max-w-[500px] w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={() => router.back()}
          className="sticky top-4 right-4 float-right ml-4 mb-4 w-11 h-11 bg-accent-coral border-[3px] border-light-border dark:border-dark-border rounded-full shadow-brutal-badge flex items-center justify-center text-white font-black text-2xl hover:shadow-brutal transition-all z-10"
          aria-label="Close"
        >
          <X size={24} strokeWidth={3} />
        </button>

        {/* Content */}
        <div className="p-6 clear-both">
          {/* Book Header */}
          <div className="flex gap-5 mb-6">
            {/* Cover */}
            <div
              className="w-[140px] h-[210px] flex-shrink-0 border-[5px] border-light-border dark:border-dark-border rounded-xl overflow-hidden shadow-brutal-badge"
              style={{
                backgroundImage: `url(${book.cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!book.cover && (
                <div className="w-full h-full bg-gradient-accent flex items-center justify-center text-5xl">
                  📚
                </div>
              )}
            </div>

            {/* Header Info */}
            <div className="flex-1 flex flex-col gap-2">
              <h1 className="font-black text-2xl leading-tight text-light-text dark:text-dark-text">
                {book.title}
              </h1>
              <p className="font-semibold text-lg text-light-textSecondary dark:text-dark-textSecondary">
                {book.author}
              </p>
              <div className="text-xs font-bold text-light-textTertiary dark:text-dark-textTertiary uppercase">
                <span className="mr-3">📖 {book.pageCount} pages</span>
                <span>📅 {book.publishYear}</span>
              </div>

              {/* Overall Match Badge */}
              <div className="mt-3 p-4 bg-accent-purple border-[3px] border-light-border dark:border-dark-border rounded-xl shadow-brutal-sm text-center">
                <div className="font-black text-4xl text-white">92%</div>
                <div className="font-black text-xs text-white uppercase">Overall Match</div>
              </div>
            </div>
          </div>

          {/* Social Proof Section */}
          <section className="mb-6">
            <h2 className="font-black text-base uppercase mb-3 text-light-text dark:text-dark-text">
              What Readers Are Saying
            </h2>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-4">
              {book.socialProof.isBestseller && (
                <div className="flex items-center gap-2 px-5 py-2.5 bg-accent-yellow border-[3px] border-light-border dark:border-dark-border rounded-xl font-black text-sm shadow-brutal-badge">
                  <span className="text-lg">🏆</span>
                  <span>NYT Bestseller</span>
                </div>
              )}
              <div className="flex items-center gap-2 px-5 py-2.5 bg-light-secondary dark:bg-dark-secondary border-[3px] border-light-border dark:border-dark-border rounded-xl font-black text-sm shadow-brutal-badge">
                <span className="text-lg">⭐</span>
                <span>{book.socialProof.rating} ({book.socialProof.ratingsCount.toLocaleString()} ratings)</span>
              </div>
            </div>

            {/* Reader Tags */}
            <div className="mb-4">
              <p className="text-xs font-bold text-light-textSecondary dark:text-dark-textSecondary mb-2">
                Readers loved:
              </p>
              <div className="flex flex-wrap gap-2">
                {book.socialProof.readerTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 bg-accent-teal border-2 border-light-border dark:border-dark-border rounded-lg text-xs font-bold shadow-brutal-badge"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Why You'll Love This */}
          <section className="mb-6 p-5 bg-light-primary dark:bg-dark-primary border-[3px] border-light-border dark:border-dark-border rounded-xl shadow-brutal-badge">
            <h2 className="font-black text-base uppercase mb-4 text-light-text dark:text-dark-text">
              Why You'll Love This
            </h2>

            <div className="flex items-baseline gap-2 mb-4 flex-wrap">
              <span className="text-xs font-bold uppercase text-light-textTertiary dark:text-dark-textTertiary">
                Your search:
              </span>
              <span className="font-black text-base text-accent-purple italic">
                "cozy mystery small town"
              </span>
            </div>

            <p className="font-medium text-[15px] leading-relaxed text-light-text dark:text-dark-text">
              This book delivers exactly that cozy small-town atmosphere you're craving, with an intimate cast of quirky characters you'll want to spend time with. The mystery unfolds slowly with clever twists that keep you guessing—perfect if you're in the mood for a slow-burn whodunit that feels like visiting a charming New England village.
            </p>
          </section>

          {/* Reviews Section */}
          <section className="mb-6">
            <h2 className="font-black text-base uppercase mb-3 text-light-text dark:text-dark-text">
              Recent Reviews
            </h2>

            <div className="flex flex-col gap-3 mb-3">
              {book.socialProof.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-3.5 bg-light-primary dark:bg-dark-primary border-2 border-light-border dark:border-dark-border rounded-xl shadow-brutal-badge"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs">{"⭐".repeat(review.stars)}</span>
                    <span className="text-xs font-bold text-light-textSecondary dark:text-dark-textSecondary">
                      @{review.username}
                    </span>
                  </div>
                  <p className="text-sm font-medium italic text-light-text dark:text-dark-text leading-relaxed">
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>

            {/* Attribution */}
            <div className="flex items-center justify-center gap-1.5 py-2">
              <span className="text-xs font-semibold text-light-textTertiary dark:text-dark-textTertiary">
                Reviews from
              </span>
              <a
                href="https://hardcover.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-black text-accent-purple hover:underline"
              >
                Hardcover →
              </a>
            </div>
          </section>

          {/* Description */}
          <section className="mb-6">
            <h2 className="font-black text-base uppercase mb-3 text-light-text dark:text-dark-text">
              Description
            </h2>
            <p className="font-medium text-[15px] leading-relaxed text-light-textSecondary dark:text-dark-textSecondary">
              {book.description}
            </p>
          </section>

          {/* Get This Book */}
          <section>
            <h2 className="font-black text-base uppercase mb-4 text-light-text dark:text-dark-text">
              Get This Book
            </h2>

            {/* Primary CTAs */}
            <div className="flex flex-col gap-3 mb-2">
              <button
                onClick={handleBookshopClick}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-accent-teal border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-base shadow-brutal-sm hover:shadow-brutal transition-all"
              >
                <span className="text-xl">📖</span>
                Buy on Bookshop.org
              </button>
              <button
                onClick={handleLibraryClick}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-accent-cyan text-white border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-base shadow-brutal-sm hover:shadow-brutal transition-all"
              >
                <span className="text-xl">📚</span>
                {userLibrary ? `Check ${userLibrary.name}` : "Set up library"}
              </button>
            </div>

            {/* Library Note */}
            <div className="text-center py-2 text-xs font-semibold text-light-textSecondary dark:text-dark-textSecondary">
              {userLibrary ? (
                <>Using {userLibrary.name} · <a href="/settings" className="underline">Change library</a></>
              ) : (
                <a href="/settings" className="underline">Set up your library in Settings</a>
              )}
            </div>

            {/* More Options */}
            <div className="mt-6 pt-5 border-t-2 border-light-borderSecondary dark:border-dark-borderSecondary">
              <h3 className="font-black text-sm uppercase text-light-textTertiary dark:text-dark-textTertiary mb-3">
                More Options
              </h3>

              <div className="flex flex-col gap-3">
                <a
                  href={`https://libro.fm/search?q=${encodeURIComponent(book.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3.5 bg-light-secondary dark:bg-dark-secondary border-2 border-light-borderSecondary dark:border-dark-borderSecondary rounded-xl hover:border-light-border dark:hover:border-dark-border hover:shadow-brutal-badge transition-all"
                >
                  <span className="text-2xl flex-shrink-0">🎧</span>
                  <div className="flex-1">
                    <div className="font-black text-[15px] text-light-text dark:text-dark-text">
                      Listen on Libro.fm
                    </div>
                    <div className="text-xs font-semibold text-light-textSecondary dark:text-dark-textSecondary">
                      Audiobook • Supports indie bookstores
                    </div>
                  </div>
                  <ExternalLink size={16} strokeWidth={3} className="text-light-textTertiary dark:text-dark-textTertiary" />
                </a>

                <a
                  href={`https://hardcover.app/books/${book.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3.5 bg-light-secondary dark:bg-dark-secondary border-2 border-light-borderSecondary dark:border-dark-borderSecondary rounded-xl hover:border-light-border dark:hover:border-dark-border hover:shadow-brutal-badge transition-all"
                >
                  <span className="text-2xl flex-shrink-0">💬</span>
                  <div className="flex-1">
                    <div className="font-black text-[15px] text-light-text dark:text-dark-text">
                      View on Hardcover
                    </div>
                    <div className="text-xs font-semibold text-light-textSecondary dark:text-dark-textSecondary">
                      See more reviews & ratings
                    </div>
                  </div>
                  <ExternalLink size={16} strokeWidth={3} className="text-light-textTertiary dark:text-dark-textTertiary" />
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
