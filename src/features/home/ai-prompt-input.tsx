/**
 * AI Prompt Input component - Ultra Bold Gen Z Design
 * Dramatic mood buttons with playful interactions
 */

'use client';

import { useState } from 'react';

const moodButtons = [
  { label: 'funny', color: 'bg-primary-orange', hoverColor: 'hover:bg-primary-pink' },
  { label: 'mind-blowing', color: 'bg-primary-yellow', hoverColor: 'hover:bg-primary-teal' },
  { label: 'love story', color: 'bg-primary-pink', hoverColor: 'hover:bg-primary-purple' },
  { label: 'magical', color: 'bg-primary-purple', hoverColor: 'hover:bg-primary-blue' },
];

export const AIPromptInput = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    // TODO: Implement AI recommendation API call
    console.log('Getting recommendations for:', prompt);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setPrompt('');
    }, 2000);
  };

  const handleMoodClick = (mood: string) => {
    setPrompt(mood);
  };

  return (
    <div className="space-y-8">
      {/* Mood Buttons Grid */}
      <div className="grid grid-cols-2 gap-4">
        {moodButtons.map((mood) => (
          <button
            key={mood.label}
            onClick={() => handleMoodClick(mood.label)}
            className={`${mood.color} ${mood.hoverColor} text-text-primary font-black py-6 px-6 rounded-pill text-lg transition-all duration-300 hover:scale-110 hover:shadow-mega hover:rotate-1 focus:outline-none focus:ring-4 focus:ring-white/50`}
          >
            {mood.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Custom Input */}
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Or describe your mood..."
            className="flex-1 px-8 py-6 rounded-pill bg-white/95 backdrop-blur-sm border-0 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-4 focus:ring-white/50 text-lg font-bold shadow-card"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="bg-text-primary text-white px-8 py-6 rounded-pill font-black text-lg hover:bg-text-primary/90 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-card focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            {isLoading ? '⚡' : '→'}
          </button>
        </div>
      </form>
    </div>
  );
}; 