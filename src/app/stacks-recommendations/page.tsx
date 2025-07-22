"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const StacksRecommendationsPage = () => {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    // Read from localStorage
    const data = localStorage.getItem('stacks_recommendations');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setBooks(parsed.books || []);
        setUserInput(parsed.userInput || '');
      } catch {}
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-black mb-6">Stacks Recommendations</h1>
      <p className="mb-8 text-lg text-text-secondary">Prompt: <span className="font-bold">{userInput}</span></p>
      <div className="space-y-6">
        {books.map((book, idx) => (
          <div key={idx} className="bg-white/90 rounded-2xl p-6 shadow-md flex gap-6 items-start">
            {book.cover && book.cover.trim() !== '' && (
              <img src={book.cover} alt={book.title} className="w-20 h-28 rounded-lg object-cover" />
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black text-text-primary mb-1">{book.title}</h2>
              <p className="text-text-secondary text-base font-bold mb-2">{book.author}</p>
              <p className="text-text-primary/80 text-base mb-3">{book.why}</p>
              <div className="flex gap-3">
                <button className="bg-primary-green text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform">Add to Queue</button>
                <button className="bg-primary-blue text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform" onClick={() => router.back()}>Refine Search</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StacksRecommendationsPage; 