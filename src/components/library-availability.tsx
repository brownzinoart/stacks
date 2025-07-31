/**
 * Library Availability Component
 * Shows nearby libraries and book availability with library-first design
 */

'use client';

import { useState, useEffect } from 'react';
import { libraryService, LibraryBook } from '@/lib/library-integration';

interface LibraryAvailabilityProps {
  isbn?: string;
  onLibrarySelect?: (library: { name: string; distance: number }) => void;
}

export const LibraryAvailability = ({ isbn, onLibrarySelect }: LibraryAvailabilityProps) => {
  const [nearbyLibraries, setNearbyLibraries] = useState<Array<{ name: string; distance: number }>>([]);
  const [bookAvailability, setBookAvailability] = useState<LibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<string | null>(null);

  useEffect(() => {
    loadNearbyLibraries();
  }, []);

  const checkBookAvailability = async () => {
    if (!isbn) return;

    setIsLoading(true);
    try {
      const availability = await libraryService.checkAvailability(isbn);
      setBookAvailability(availability);
    } catch (error) {
      console.error('Error checking book availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isbn) {
      checkBookAvailability();
    }
  }, [isbn]);

  const loadNearbyLibraries = async () => {
    setIsLoading(true);
    try {
      // Mock user location (in real app, get from GPS or user settings)
      const libraries = await libraryService.getNearbyLibraries(40.7128, -74.006);
      setNearbyLibraries(libraries);
    } catch (error) {
      console.error('Error loading nearby libraries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLibrarySelect = (libraryName: string) => {
    setSelectedLibrary(libraryName);
    const library = nearbyLibraries.find((lib) => lib.name === libraryName);
    if (library && onLibrarySelect) {
      onLibrarySelect(library);
    }
  };

  const handleReserveBook = async (bookId: string, libraryName: string) => {
    setIsLoading(true);
    try {
      const success = await libraryService.reserveBook(bookId, libraryName);
      if (success) {
        // Refresh availability
        await checkBookAvailability();
        alert('Book reserved successfully!');
      } else {
        alert('Sorry, this book is no longer available.');
      }
    } catch (error) {
      console.error('Error reserving book:', error);
      alert('Error reserving book. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Nearby Libraries */}
      <div className="outline-bold-thin rounded-2xl bg-primary-teal p-6">
        <h3 className="mb-4 text-lg font-black text-text-primary">Nearby Libraries</h3>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="loading-pulse text-2xl">LOADING</div>
            <p className="mt-2 text-sm font-bold text-text-secondary">Finding libraries...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {nearbyLibraries.map((library, index) => (
              <button
                key={library.name}
                onClick={() => handleLibrarySelect(library.name)}
                className={`touch-feedback mobile-touch w-full rounded-xl p-4 transition-all duration-300 ${
                  selectedLibrary === library.name
                    ? 'shadow-backdrop scale-105 bg-white/90'
                    : 'bg-white/70 hover:scale-105 hover:bg-white/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="text-base font-black text-text-primary">{library.name}</h4>
                    <p className="text-sm font-bold text-text-secondary">{library.distance} miles away</p>
                  </div>
                  <div className="text-right">
                    <div className="h-3 w-3 rounded-full bg-primary-green"></div>
                    <p className="mt-1 text-xs font-bold text-primary-green">OPEN</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Book Availability */}
      {isbn && bookAvailability.length > 0 && (
        <div className="outline-bold-thin rounded-2xl bg-primary-yellow p-6">
          <h3 className="mb-4 text-lg font-black text-text-primary">Book Availability</h3>

          <div className="space-y-4">
            {bookAvailability.map((book) => (
              <div key={`${book.libraryName}-${book.id}`} className="rounded-xl bg-white/90 p-4">
                <div className="flex items-start gap-4">
                  {book.coverUrl && (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="shadow-backdrop h-16 w-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="mb-1 text-sm font-black text-text-primary">{book.title}</h4>
                    <p className="mb-2 text-xs font-bold text-text-secondary">{book.author}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            book.available ? 'bg-primary-green' : 'bg-primary-orange'
                          }`}
                        ></div>
                        <span
                          className={`text-xs font-bold ${
                            book.available ? 'text-primary-green' : 'text-primary-orange'
                          }`}
                        >
                          {book.available ? 'AVAILABLE' : 'CHECKED OUT'}
                        </span>
                      </div>

                      {book.available ? (
                        <button
                          onClick={() => handleReserveBook(book.id, book.libraryName)}
                          disabled={isLoading}
                          className="touch-feedback rounded-full bg-primary-blue px-3 py-1 text-xs font-bold text-white transition-transform hover:scale-105"
                        >
                          {isLoading ? '...' : 'RESERVE'}
                        </button>
                      ) : (
                        <div className="text-right">
                          <p className="text-xs text-text-secondary">Due: {book.dueDate}</p>
                          {book.waitlistCount && (
                            <p className="text-xs font-bold text-primary-orange">{book.waitlistCount} on waitlist</p>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="mt-2 text-xs text-text-secondary">Location: {book.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Library-First CTA */}
      <div className="outline-bold-thin rounded-2xl bg-primary-green p-6 text-center">
        <h3 className="mb-2 text-lg font-black text-text-primary">Library-First</h3>
        <p className="mb-4 text-sm font-bold text-text-primary">We prioritize local libraries over online retailers</p>
        <button className="touch-feedback rounded-full bg-text-primary px-6 py-3 text-sm font-black text-white transition-transform hover:scale-105">
          FIND MORE LIBRARIES →
        </button>
      </div>
    </div>
  );
};
