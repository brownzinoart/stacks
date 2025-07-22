"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { BookCover } from '@/components/book-cover';
import axios from 'axios';

const getQueue = () => {
  try {
    return JSON.parse(localStorage.getItem('stacks_queue') || '[]');
  } catch {
    return [];
  }
};
const setQueue = (queue: any[]) => {
  localStorage.setItem('stacks_queue', JSON.stringify(queue));
};

const isRealCoverUrl = (url: string) => url && url.startsWith('http');

const fetchOpenLibraryBackCover = async (title: string, author: string) => {
  try {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=1`;
    const res = await axios.get(url);
    const doc = res.data.docs && res.data.docs[0];
    if (!doc) return null;
    let backCover = null;
    if (doc.cover_edition_key) {
      backCover = `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-L.jpg?default=false&back=true`;
    }
    return { backCover };
  } catch {
    return null;
  }
};

// Barcode SVG for back cover
const Barcode = () => (
  <svg width="80" height="32" viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-4">
    <rect x="0" y="0" width="80" height="32" rx="4" fill="#fff" />
    <rect x="6" y="6" width="2" height="20" fill="#222" />
    <rect x="10" y="6" width="1" height="20" fill="#222" />
    <rect x="13" y="6" width="3" height="20" fill="#222" />
    <rect x="18" y="6" width="2" height="20" fill="#222" />
    <rect x="22" y="6" width="1" height="20" fill="#222" />
    <rect x="25" y="6" width="2" height="20" fill="#222" />
    <rect x="29" y="6" width="1" height="20" fill="#222" />
    <rect x="32" y="6" width="3" height="20" fill="#222" />
    <rect x="37" y="6" width="2" height="20" fill="#222" />
    <rect x="41" y="6" width="1" height="20" fill="#222" />
    <rect x="44" y="6" width="2" height="20" fill="#222" />
    <rect x="48" y="6" width="1" height="20" fill="#222" />
    <rect x="51" y="6" width="3" height="20" fill="#222" />
    <rect x="56" y="6" width="2" height="20" fill="#222" />
    <rect x="60" y="6" width="1" height="20" fill="#222" />
    <rect x="63" y="6" width="2" height="20" fill="#222" />
    <rect x="67" y="6" width="1" height="20" fill="#222" />
    <rect x="70" y="6" width="3" height="20" fill="#222" />
    <rect x="75" y="6" width="2" height="20" fill="#222" />
  </svg>
);

const StacksRecommendationsPage = () => {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [userInput, setUserInput] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [added, setAdded] = useState<{[key: number]: boolean}>({});
  const [borrowed, setBorrowed] = useState<{[key: number]: boolean}>({});
  const [showModal, setShowModal] = useState(false);
  const [modalBook, setModalBook] = useState<any>(null);
  const [coverUrls, setCoverUrls] = useState<{[key: number]: string}>({});
  const [flip, setFlip] = useState(false);
  const [backCover, setBackCover] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Load books and userInput from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem('stacks_recommendations');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setBooks(parsed.books || []);
        setUserInput(parsed.userInput || '');
        setSearchValue(parsed.userInput || '');
      } catch {}
    }
  }, []);

  // Update 'added' state when books change
  useEffect(() => {
    const queue = getQueue();
    const addedState: {[key: number]: boolean} = {};
    books.forEach((book, idx) => {
      if (queue.find((b: any) => b.title === book.title && b.author === book.author)) {
        addedState[idx] = true;
      }
    });
    setAdded(addedState);
  }, [books]);

  // Fetch OpenLibrary covers for books missing real covers
  useEffect(() => {
    const fetchCovers = async () => {
      const updates: {[key: number]: string} = {};
      await Promise.all(books.map(async (book, idx) => {
        if (book.cover && book.cover.startsWith('http')) return;
        if (!book.title || !book.author) return;
        try {
          const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}&limit=1`;
          const res = await axios.get(url);
          const doc = res.data.docs && res.data.docs[0];
          if (doc && doc.cover_i) {
            updates[idx] = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
          }
        } catch {}
      }));
      if (Object.keys(updates).length > 0) {
        setCoverUrls(prev => ({ ...prev, ...updates }));
      }
    };
    if (books.length > 0) fetchCovers();
  }, [books]);

  const handleAddToQueue = (book: any, idx: number) => {
    const queue = getQueue();
    if (!queue.find((b: any) => b.title === book.title && b.author === book.author)) {
      queue.push(book);
      setQueue(queue);
      setAdded((prev) => ({ ...prev, [idx]: true }));
    }
  };

  const handleBorrow = (idx: number) => {
    setBorrowed((prev) => ({ ...prev, [idx]: true }));
    setTimeout(() => setBorrowed((prev) => ({ ...prev, [idx]: false })), 1500);
  };

  const handleLearnMore = async (book: any) => {
    setModalBook(book);
    setShowModal(true);
    setFlip(false);
    setBackCover(null);
    // Try to fetch back cover only
    const data = await fetchOpenLibraryBackCover(book.title, book.author);
    if (data) {
      setBackCover(data.backCover);
    }
  };

  // Swipe/drag handler for flip
  const startX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current !== null) {
      const dx = e.changedTouches[0].clientX - startX.current;
      if (Math.abs(dx) > 60) setFlip(f => !f);
      startX.current = null;
    }
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    if (startX.current !== null) {
      const dx = e.clientX - startX.current;
      if (Math.abs(dx) > 60) setFlip(f => !f);
      startX.current = null;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Save new search to localStorage and reload page
    localStorage.setItem('stacks_recommendations', JSON.stringify({ books: [], userInput: searchValue }));
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen bg-bg-light flex flex-col items-center py-12 px-4">
      {/* Decorative elements */}
      <div className="absolute top-4 left-6 w-14 h-14 sm:w-18 sm:h-18 bg-primary-teal rounded-full opacity-25 animate-float z-0" />
      <div className="absolute bottom-6 right-6 w-10 h-10 sm:w-14 sm:h-14 bg-primary-pink rounded-full opacity-30 animate-float-delayed z-0" />
      <div className="absolute top-8 right-4 w-8 h-8 sm:w-12 sm:h-12 bg-primary-orange rounded-full opacity-35 animate-float-slow z-0" />
      <div className="absolute bottom-8 left-4 w-12 h-12 sm:w-16 sm:h-16 bg-primary-blue rounded-full opacity-20 animate-float z-0" />
      <div className="absolute top-2 right-2 w-6 h-6 sm:w-8 h-8 bg-primary-green rounded-full opacity-40 animate-float-delayed z-0" />
      <div className="absolute bottom-4 left-2 w-10 h-10 sm:w-12 sm:h-12 bg-primary-purple rounded-full opacity-30 animate-float-slow z-0" />

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <h1 className="text-huge font-black text-text-primary leading-extra-tight mb-6">
          <span className="text-primary-yellow">STACKS</span><br />
          <span className="text-mega">RECOMMENDATIONS</span>
        </h1>
        {/* Search box for refinement */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-4 items-center">
          <input
            type="text"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            className="flex-1 px-6 py-4 rounded-full bg-white outline-bold-thin text-text-primary font-bold text-lg shadow-backdrop"
            placeholder="Refine your search..."
          />
          <button type="submit" className="bg-primary-blue text-white px-6 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform touch-feedback">
            Search
          </button>
        </form>
        <div className="space-y-6">
          {books.map((book, idx) => (
            <div key={idx} className="bg-white/90 rounded-3xl p-6 shadow-[0_10px_40px_rgb(0,0,0,0.15)] flex gap-8 items-start outline-bold-thin hover:scale-[1.01] transition-all duration-300 relative">
              {/* Prominent Book Cover: use real cover if available */}
              <div className="flex-shrink-0">
                <BookCover title={book.title} author={book.author} coverUrl={book.cover && book.cover.startsWith('http') ? book.cover : coverUrls[idx]} className="w-32 h-44 sm:w-40 sm:h-56 shadow-[0_8px_30px_rgb(0,0,0,0.25)] border-4 border-primary-blue outline-bold-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-black text-text-primary mb-1">{book.title}</h2>
                <p className="text-text-secondary text-base sm:text-lg font-bold mb-2">{book.author}</p>
                <p className="text-text-primary/80 text-base mb-3">{book.why}</p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    className={`bg-primary-green text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform ${added[idx] ? 'bg-primary-blue' : ''}`}
                    onClick={() => handleAddToQueue(book, idx)}
                    disabled={added[idx]}
                  >
                    {added[idx] ? 'Added!' : 'Add to Queue'}
                  </button>
                  <button
                    className={`bg-primary-yellow text-text-primary px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform ${borrowed[idx] ? 'bg-primary-green' : ''}`}
                    onClick={() => handleBorrow(idx)}
                    disabled={borrowed[idx]}
                  >
                    {borrowed[idx] ? 'Borrowed!' : 'Borrow Book'}
                  </button>
                  <button
                    className="bg-primary-blue text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                    onClick={() => handleLearnMore(book)}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Learn More */}
      {showModal && modalBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="relative w-[420px] sm:w-[540px] h-[640px] sm:h-[800px] flex items-center justify-center animate-float-book">
            <button className="absolute top-4 right-4 z-20 text-2xl font-black text-primary-blue hover:scale-110" onClick={() => setShowModal(false)}>&times;</button>
            <div
              ref={cardRef}
              className={`relative w-full h-full perspective-1200`}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              style={{ cursor: 'grab' }}
            >
              <div
                className={`absolute w-full h-full transition-transform duration-[1200ms] [transform-style:preserve-3d] ${flip ? 'rotate-y-180' : ''}`}
                style={{ willChange: 'transform' }}
              >
                {/* Spine and page edge */}
                <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-b from-primary-blue via-primary-purple to-primary-blue rounded-l-2xl shadow-lg z-10" style={{ zIndex: 2, filter: 'blur(0.5px)', opacity: 0.85 }} />
                <div className="absolute right-0 top-0 w-3 h-full bg-gradient-to-b from-white/80 via-white/60 to-white/90 rounded-r-2xl z-10 opacity-80" style={{ zIndex: 2 }} />
                {/* Front: Real book cover */}
                <div className="absolute w-full h-full [backface-visibility:hidden] flex flex-col items-center justify-center bg-gradient-to-br from-white via-primary-blue/5 to-white rounded-3xl shadow-2xl" style={{ boxShadow: '0 16px 64px 0 rgba(0,0,0,0.45)' }}>
                  {(() => {
                    let coverUrl = undefined;
                    if (modalBook.cover && modalBook.cover.startsWith('http')) {
                      coverUrl = modalBook.cover;
                    } else if (books && modalBook) {
                      const idx = books.findIndex(b => b.title === modalBook.title && b.author === modalBook.author);
                      if (idx >= 0 && coverUrls && coverUrls[idx]) {
                        coverUrl = coverUrls[idx];
                      }
                    }
                    return (
                      <div className="w-64 h-96 sm:w-80 sm:h-[28rem] mx-auto mb-6 shadow-[0_16px_64px_rgb(0,0,0,0.45)] border-8 border-primary-blue outline-bold-lg rounded-2xl overflow-hidden flex items-stretch justify-stretch">
                        <BookCover
                          title={modalBook.title}
                          author={modalBook.author}
                          coverUrl={coverUrl}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      </div>
                    );
                  })()}
                  <h2 className="text-3xl font-black text-text-primary mb-1 text-center drop-shadow-lg">{modalBook.title}</h2>
                  <p className="text-text-secondary text-lg font-bold mb-2 text-center drop-shadow">{modalBook.author}</p>
                  <button className="mt-6 bg-primary-orange text-white px-8 py-3 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-lg" onClick={() => setFlip(true)}>Flip to Back</button>
                </div>
                {/* Back: Real back cover or summary/why/excerpt */}
                <div className="absolute w-full h-full [backface-visibility:hidden] rotate-y-180 flex flex-col items-center justify-center bg-gradient-to-br from-primary-blue/90 via-primary-purple/90 to-primary-blue/95 rounded-3xl shadow-2xl p-8" style={{ boxShadow: '0 16px 64px 0 rgba(0,0,0,0.45)' }}>
                  {backCover ? (
                    <div className="w-64 h-96 sm:w-80 sm:h-[28rem] mx-auto mb-6 shadow-[0_16px_64px_rgb(0,0,0,0.45)] border-8 border-primary-blue outline-bold-lg rounded-2xl overflow-hidden flex items-stretch justify-stretch">
                      <img src={backCover} alt="Back cover" className="w-full h-full object-cover rounded-2xl" />
                    </div>
                  ) : (
                    <div className="w-64 h-96 sm:w-80 sm:h-[28rem] mx-auto mb-6 flex flex-col items-center justify-center bg-primary-blue/10 rounded-2xl border-8 border-primary-blue outline-bold-lg relative">
                      <span className="text-white font-black text-xl mb-4 text-center drop-shadow-lg">No Back Cover</span>
                      <Barcode />
                    </div>
                  )}
                  <h2 className="text-2xl font-black text-white mb-2 text-center drop-shadow-lg">About this book</h2>
                  <p className="text-white/90 text-lg mb-8 text-center drop-shadow">{modalBook.why}</p>
                  <button className="mt-6 bg-primary-blue text-white px-8 py-3 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-lg" onClick={() => setFlip(false)}>Flip to Front</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add floating animation */}
      <style jsx global>{`
        .animate-float-book {
          animation: floatBook 4.5s cubic-bezier(.4,1.6,.6,1) infinite alternate;
        }
        @keyframes floatBook {
          0% { transform: translateY(0) rotateZ(-1deg) scale(1.01); }
          100% { transform: translateY(-8px) rotateZ(1deg) scale(1.03); }
        }
        .perspective-1200 {
          perspective: 1200px;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default StacksRecommendationsPage; 