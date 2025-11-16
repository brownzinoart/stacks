/**
 * Search Results Page
 * Displays natural language search results in 3 categories: Plot, Characters, Atmosphere
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Sparkles, BookOpen, Users, Palette, ExternalLink, Eye, Heart, Star } from 'lucide-react';
import { aiSearchService } from '../src/lib/ai-search';
import { BookCoverSimple } from '../src/components/book-cover-simple';
import { ExpandableText } from '../src/components/expandable-text';

interface BookRecommendation {
  title: string;
  author: string;
  isbn?: string;
  coverUrl?: string;
  description?: string;
  reason?: string;
  // Enhanced Google Books data
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  language?: string;
  previewLink?: string;
  infoLink?: string;
  googleBooksId?: string;
}

interface SearchResults {
  query: string;
  plot: BookRecommendation[];
  characters: BookRecommendation[];
  atmosphere: BookRecommendation[];
  totalBooks: number;
}

export default function SearchResultsPage() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (q && typeof q === 'string') {
      performSearch(q);
    }
  }, [q]);

  const performSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const searchResults = await aiSearchService.searchBooks(query);
      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Sorry, search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Head>
          <title>Searching... • Stacks</title>
        </Head>
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/discover" className="text-text-secondary hover:text-text-primary">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold text-text-primary">Searching...</h1>
          </div>

          {/* Loading animation */}
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-2 border-primary-pink border-t-transparent rounded-full mx-auto"></div>
              <p className="text-text-secondary">Finding perfect books for "{q}"...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Head>
          <title>Search Error • Stacks</title>
        </Head>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/discover" className="text-text-secondary hover:text-text-primary">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold text-text-primary">Search Error</h1>
          </div>

          <div className="text-center py-20">
            <p className="text-text-secondary mb-4">{error}</p>
            <button 
              onClick={() => q && performSearch(q as string)}
              className="bg-primary-pink text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Head>
        <title>"{results.query}" Results • Stacks</title>
        <meta name="description" content={`Book recommendations for "${results.query}"`} />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/discover" className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Search Results</h1>
            <p className="text-text-secondary">for "{results.query}"</p>
          </div>
        </div>

        {/* Results intro */}
        <div className="mb-8 p-6 rounded-3xl bg-white border-4 border-black shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-primary-green" />
            <h2 className="text-lg font-bold text-text-primary">Perfect Matches Found!</h2>
          </div>
          <p className="text-text-secondary text-center">
            We found {results.totalBooks} books organized by what makes them special
          </p>
        </div>

        {/* Results categories */}
        <div className="space-y-8">
          {/* Plot Category */}
          <CategorySection
            title="Compelling Plot"
            icon={<BookOpen className="w-5 h-5" />}
            color="primary-pink"
            books={results.plot}
            description="Books with gripping storylines and narrative arcs"
          />

          {/* Characters Category */}
          <CategorySection
            title="Rich Characters"
            icon={<Users className="w-5 h-5" />}
            color="primary-green"
            books={results.characters}
            description="Books with memorable, well-developed characters"
          />

          {/* Atmosphere Category */}
          <CategorySection
            title="Immersive Atmosphere"
            icon={<Palette className="w-5 h-5" />}
            color="primary-blue"
            books={results.atmosphere}
            description="Books with distinctive mood and setting"
          />
        </div>

        {/* Search again */}
        <div className="mt-12 text-center">
          <Link 
            href="/discover"
            className="inline-flex items-center gap-2 text-primary-pink hover:text-primary-pink/80 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Search for something else
          </Link>
        </div>
      </div>
    </div>
  );
}

interface CategorySectionProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  books: BookRecommendation[];
  description: string;
}

function CategorySection({ title, icon, color, books, description }: CategorySectionProps) {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Category header */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${color}/10`}>
          <div className={`text-${color}`}>
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>

      {/* Books grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {books.map((book, index) => (
          <BookCard key={`${book.title}-${index}`} book={book} categoryColor={color} />
        ))}
      </div>
    </div>
  );
}

interface BookCardProps {
  book: BookRecommendation;
  categoryColor?: string;
}

function BookCard({ book, categoryColor = 'primary-pink' }: BookCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className={`p-8 rounded-3xl bg-${categoryColor}/10 backdrop-blur-sm border-4 border-black shadow-2xl hover:shadow-3xl transition-all duration-300`}>
        <div className="flex gap-8 items-center">
          {/* Larger Book Cover - Left Side */}
          <div className="flex-shrink-0 w-40 h-60 sm:w-44 sm:h-66">
            <BookCoverSimple
              title={book.title}
              author={book.author}
              coverUrl={book.coverUrl}
              className="w-full h-full rounded-xl overflow-hidden shadow-2xl"
            />
          </div>

          {/* Book Details - Left Aligned, Contained */}
          <div className="flex-1 space-y-4 text-left max-w-md">
            <div>
              <h4 className="text-2xl sm:text-3xl font-black text-text-primary leading-tight mb-1">
                {book.title}
              </h4>
              <p className="text-lg font-bold text-text-secondary">
                by {book.author}
              </p>
            </div>

            {/* Description - Fixed Height, Mobile-Optimized */}
            {book.description && (
              <div className="p-4 rounded-xl bg-white border-2 border-text-primary/20 shadow-sm">
                <div className="h-[60px] overflow-hidden">
                  <p className="text-sm text-text-primary leading-5">
                    {book.description}
                  </p>
                </div>
              </div>
            )}
            
            {/* Why It Matches - Fixed Height, Mobile-Optimized */}
            {book.reason && (
              <div className="p-4 rounded-xl bg-white border-2 border-text-primary/30 shadow-sm">
                <div className="h-[40px] overflow-hidden">
                  <p className="text-sm font-bold text-text-primary leading-5">
                    {book.reason}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons - White Background, Left Aligned, Reordered */}
            <div className="flex gap-2 justify-start pt-2">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-3 bg-white hover:bg-gray-100 text-text-primary font-black rounded-xl transition-all duration-300 text-xs flex items-center gap-1 border-2 border-black shadow-sm min-h-[42px]"
              >
                <Eye className="w-3 h-3" />
                Details
              </button>
              
              {book.infoLink && (
                <a
                  href={book.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-white hover:bg-gray-100 text-text-primary font-black rounded-xl transition-all duration-300 text-xs flex items-center gap-1 border-2 border-black shadow-sm whitespace-nowrap min-h-[42px]"
                >
                  <ExternalLink className="w-3 h-3" />
                  Find Book
                </a>
              )}
              
              <button
                onClick={() => {
                  // TODO: Implement add to maybe's functionality
                  console.log('Adding to maybes:', book.title);
                }}
                className="px-4 py-3 bg-white hover:bg-gray-100 text-text-primary font-black rounded-xl transition-all duration-300 text-xs flex items-center gap-1 border-2 border-black shadow-sm min-h-[42px]"
              >
                <Heart className="w-3 h-3" />
                Maybe's
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Book Details Modal */}
      {showDetails && (
        <BookDetailsModal 
          book={book} 
          onClose={() => setShowDetails(false)} 
        />
      )}
    </>
  );
}

interface BookDetailsModalProps {
  book: BookRecommendation;
  onClose: () => void;
}

function BookDetailsModal({ book, onClose }: BookDetailsModalProps) {
  const getPublicationYear = () => {
    if (book.publishedDate) {
      return book.publishedDate.split('-')[0];
    }
    return null;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="p-8 rounded-3xl bg-white border-4 border-black shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-20 h-32">
                <BookCoverSimple
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  className="w-full h-full rounded-xl overflow-hidden shadow-lg"
                />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-text-primary leading-tight mb-2">
                  {book.title}
                </h2>
                <p className="text-lg font-bold text-text-secondary mb-2">
                  by {book.author}
                </p>
                {book.averageRating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-text-primary">
                        {book.averageRating.toFixed(1)}
                      </span>
                    </div>
                    {book.ratingsCount && (
                      <span className="text-xs text-text-secondary">
                        ({book.ratingsCount} reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 p-0 flex items-center justify-center bg-white hover:bg-gray-100 text-text-primary font-black rounded-xl transition-all duration-300 border-2 border-black shadow-sm"
            >
              ×
            </button>
          </div>

          {/* Publication Details */}
          <div className="p-4 rounded-xl bg-white border-2 border-text-primary/20 shadow-sm">
            <h3 className="text-lg font-black text-text-primary mb-3">Publication Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {getPublicationYear() && (
                <div>
                  <span className="font-bold text-text-secondary">Published:</span>
                  <p className="text-text-primary">{getPublicationYear()}</p>
                </div>
              )}
              {book.publisher && (
                <div>
                  <span className="font-bold text-text-secondary">Publisher:</span>
                  <p className="text-text-primary">{book.publisher}</p>
                </div>
              )}
              {book.pageCount && (
                <div>
                  <span className="font-bold text-text-secondary">Pages:</span>
                  <p className="text-text-primary">{book.pageCount}</p>
                </div>
              )}
              {book.language && (
                <div>
                  <span className="font-bold text-text-secondary">Language:</span>
                  <p className="text-text-primary">{book.language.toUpperCase()}</p>
                </div>
              )}
            </div>
            
            {book.categories && book.categories.length > 0 && (
              <div className="mt-4">
                <span className="font-bold text-text-secondary">Categories:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {book.categories.slice(0, 3).map((category, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-primary-blue/20 text-text-primary text-xs rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description - Use Long Form in Modal */}
          {(book.descriptionLong || book.description) && (
            <div className="p-4 rounded-xl bg-white border-2 border-text-primary/20 shadow-sm">
              <h3 className="text-lg font-black text-text-primary mb-3">About This Book</h3>
              <p className="text-text-secondary leading-relaxed">
                {book.descriptionLong || book.description}
              </p>
            </div>
          )}

          {/* Why It Matches - Use Long Form in Modal */}
          {(book.reasonLong || book.reason) && (
            <div className="p-4 rounded-xl bg-white border-2 border-text-primary/30 shadow-sm">
              <h3 className="text-lg font-black text-text-primary mb-3">Why It Matches Your Search</h3>
              <p className="text-text-primary font-bold leading-relaxed">
                {book.reasonLong || book.reason}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            {book.previewLink && (
              <a
                href={book.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-white hover:bg-gray-100 text-text-primary font-black rounded-xl transition-all duration-300 text-sm flex items-center gap-2 border-2 border-black shadow-sm min-h-[42px]"
              >
                <BookOpen className="w-4 h-4" />
                Preview Book
              </a>
            )}
            
            {book.infoLink && (
              <a
                href={book.infoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-white hover:bg-gray-100 text-text-primary font-black rounded-xl transition-all duration-300 text-sm flex items-center gap-2 border-2 border-black shadow-sm min-h-[42px] whitespace-nowrap"
              >
                <ExternalLink className="w-4 h-4" />
                Find This Book
              </a>
            )}
            
            <button
              onClick={() => {
                // TODO: Implement add to maybe's functionality
                console.log('Adding to maybes:', book.title);
                onClose();
              }}
              className="px-4 py-3 bg-white hover:bg-gray-100 text-text-primary font-black rounded-xl transition-all duration-300 text-sm flex items-center gap-2 border-2 border-black shadow-sm min-h-[42px]"
            >
              <Heart className="w-4 h-4" />
              Add to Maybe's
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}