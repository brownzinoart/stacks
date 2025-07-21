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
  const [nearbyLibraries, setNearbyLibraries] = useState<Array<{name: string, distance: number}>>([]);
  const [bookAvailability, setBookAvailability] = useState<LibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<string | null>(null);

  useEffect(() => {
    loadNearbyLibraries();
  }, []);

  useEffect(() => {
    if (isbn) {
      checkBookAvailability();
    }
  }, [isbn]);

  const loadNearbyLibraries = async () => {
    setIsLoading(true);
    try {
      // Mock user location (in real app, get from GPS or user settings)
      const libraries = await libraryService.getNearbyLibraries(40.7128, -74.0060);
      setNearbyLibraries(libraries);
    } catch (error) {
      console.error('Error loading nearby libraries:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleLibrarySelect = (libraryName: string) => {
    setSelectedLibrary(libraryName);
    const library = nearbyLibraries.find(lib => lib.name === libraryName);
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
      <div className="bg-primary-teal rounded-2xl p-6 outline-bold-thin">
        <h3 className="text-lg font-black text-text-primary mb-4">Nearby Libraries</h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="loading-pulse text-2xl">LOADING</div>
            <p className="text-text-secondary text-sm font-bold mt-2">Finding libraries...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {nearbyLibraries.map((library, index) => (
              <button
                key={library.name}
                onClick={() => handleLibrarySelect(library.name)}
                className={`w-full p-4 rounded-xl transition-all duration-300 touch-feedback mobile-touch ${
                  selectedLibrary === library.name
                    ? 'bg-white/90 shadow-backdrop scale-105'
                    : 'bg-white/70 hover:bg-white/90 hover:scale-105'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="font-black text-text-primary text-base">{library.name}</h4>
                    <p className="text-text-secondary text-sm font-bold">{library.distance} miles away</p>
                  </div>
                  <div className="text-right">
                    <div className="w-3 h-3 bg-primary-green rounded-full"></div>
                    <p className="text-xs font-bold text-primary-green mt-1">OPEN</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Book Availability */}
      {isbn && bookAvailability.length > 0 && (
        <div className="bg-primary-yellow rounded-2xl p-6 outline-bold-thin">
          <h3 className="text-lg font-black text-text-primary mb-4">Book Availability</h3>
          
          <div className="space-y-4">
            {bookAvailability.map((book) => (
              <div key={`${book.libraryName}-${book.id}`} className="bg-white/90 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  {book.coverUrl && (
                    <img 
                      src={book.coverUrl} 
                      alt={book.title}
                      className="w-12 h-16 rounded-lg object-cover shadow-backdrop"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-text-primary text-sm mb-1">{book.title}</h4>
                    <p className="text-text-secondary text-xs font-bold mb-2">{book.author}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          book.available ? 'bg-primary-green' : 'bg-primary-orange'
                        }`}></div>
                        <span className={`text-xs font-bold ${
                          book.available ? 'text-primary-green' : 'text-primary-orange'
                        }`}>
                          {book.available ? 'AVAILABLE' : 'CHECKED OUT'}
                        </span>
                      </div>
                      
                      {book.available ? (
                        <button
                          onClick={() => handleReserveBook(book.id, book.libraryName)}
                          disabled={isLoading}
                          className="bg-primary-blue text-white px-3 py-1 rounded-full text-xs font-bold hover:scale-105 transition-transform touch-feedback"
                        >
                          {isLoading ? '...' : 'RESERVE'}
                        </button>
                      ) : (
                        <div className="text-right">
                          <p className="text-xs text-text-secondary">Due: {book.dueDate}</p>
                          {book.waitlistCount && (
                            <p className="text-xs text-primary-orange font-bold">
                              {book.waitlistCount} on waitlist
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-text-secondary mt-2">
                      Location: {book.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Library-First CTA */}
      <div className="bg-primary-green rounded-2xl p-6 outline-bold-thin text-center">
        <h3 className="text-lg font-black text-text-primary mb-2">Library-First</h3>
        <p className="text-text-primary text-sm font-bold mb-4">
          We prioritize local libraries over online retailers
        </p>
        <button className="bg-text-primary text-white px-6 py-3 rounded-full font-black text-sm hover:scale-105 transition-transform touch-feedback">
          FIND MORE LIBRARIES →
        </button>
      </div>
    </div>
  );
}; 