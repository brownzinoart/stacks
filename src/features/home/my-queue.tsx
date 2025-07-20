/**
 * My Queue component - Ultra Bold Gen Z Design
 * Dramatic book cards with massive typography
 */

'use client';

const mockQueueBooks = [
  { 
    id: 1, 
    title: 'The Seven Husbands of Evelyn Hugo', 
    author: 'Taylor Jenkins Reid', 
    status: 'ready',
    color: 'bg-primary-green'
  },
  { 
    id: 2, 
    title: 'Atomic Habits', 
    author: 'James Clear', 
    status: 'hold',
    color: 'bg-primary-teal'
  },
  { 
    id: 3, 
    title: 'The Silent Patient', 
    author: 'Alex Michaelides', 
    status: 'hold',
    color: 'bg-primary-purple'
  },
];

export const MyQueue = () => {
  return (
    <div className="bg-white rounded-3xl p-12 shadow-[0_10px_40px_rgb(0,0,0,0.3)] relative overflow-hidden">
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-black text-text-primary mb-2 uppercase tracking-wider">YOUR</h2>
            <h1 className="text-huge font-black text-text-primary leading-extra-tight">
              <span className="text-primary-pink">BOOK</span><br />
              <span className="text-mega">QUEUE</span>
            </h1>
          </div>
          <div className="bg-primary-orange text-white text-sm font-black px-4 py-2 rounded-full shadow-[0_4px_15px_rgb(0,0,0,0.2)]">
            {mockQueueBooks.length} BOOKS
          </div>
        </div>
        
        <div className="space-y-6">
          {mockQueueBooks.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-text-primary mb-4">Nothing here yet! 📚</h3>
              <p className="text-text-secondary text-lg font-medium">
                Search for something amazing to add to your queue
              </p>
            </div>
          ) : (
            mockQueueBooks.map((book) => (
              <div key={book.id} className="flex items-start gap-6 p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border-2 border-transparent hover:border-primary-green/20">
                <div className={`w-16 h-20 ${book.color} rounded-2xl flex-shrink-0 flex items-center justify-center shadow-[0_4px_15px_rgb(0,0,0,0.2)] hover:rotate-3 transition-transform duration-300 relative`}>
                  <div className="w-8 h-8 bg-white/40 rounded-lg" />
                  {/* Book spine detail */}
                  <div className="absolute left-1 top-2 bottom-2 w-1 bg-white/60 rounded-full" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-text-primary text-lg leading-tight mb-2">{book.title}</h3>
                  <p className="text-text-secondary text-sm font-bold mb-4">{book.author}</p>
                  
                  <div>
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-black shadow-[0_4px_15px_rgb(0,0,0,0.2)] ${
                      book.status === 'ready'
                        ? 'bg-primary-green text-text-primary'
                        : 'bg-primary-yellow text-text-primary'
                    }`}>
                      {book.status === 'ready' ? 'READY TO READ!' : 'ON HOLD'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {mockQueueBooks.length > 0 && (
          <button className="w-full bg-text-primary text-white font-black py-6 px-8 rounded-full hover:bg-text-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_4px_15px_rgb(0,0,0,0.3)] text-lg">
            VIEW ALL BOOKS →
          </button>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-blue rounded-full opacity-20" />
    </div>
  );
}; 