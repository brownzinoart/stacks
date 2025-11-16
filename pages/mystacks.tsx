/**
 * MyStacks page - Personal book management and StackSnap feature
 * Core Features: StackSnap (OCR shelf scanning), Stats Dashboard, Personal Progress
 */

'use client'

import { useState, useCallback } from 'react'
import { MobileLayout } from '@/components/mobile-layout'

// Import existing components
import { MyQueue } from '@/features/home/my-queue'
import { ReadingStreak } from '@/features/home/reading-streak'

// Mock OCR results for demonstration
const MOCK_OCR_RESULTS = [
  { id: 1, title: 'The Midnight Library', author: 'Matt Haig', confidence: 95, x: 120, y: 50, width: 180, height: 240 },
  { id: 2, title: 'Atomic Habits', author: 'James Clear', confidence: 92, x: 320, y: 45, width: 175, height: 245 },
  { id: 3, title: 'The Seven Husbands', author: 'Taylor Jenkins Reid', confidence: 88, x: 515, y: 52, width: 170, height: 235 },
  { id: 4, title: 'Where the Crawdads Sing', author: 'Delia Owens', confidence: 94, x: 125, y: 320, width: 172, height: 240 },
  { id: 5, title: 'The Guest List', author: 'Lucy Foley', confidence: 89, x: 318, y: 315, width: 178, height: 242 }
]

const ACHIEVEMENT_BADGES = [
  { id: 1, name: 'First Snap', icon: '📸', description: 'Captured your first shelf', unlocked: true },
  { id: 2, name: 'Book Hunter', icon: '🔍', description: 'Identified 50+ books', unlocked: true },
  { id: 3, name: 'Shelf Master', icon: '📚', description: 'Scanned 10 different shelves', unlocked: false },
  { id: 4, name: 'Speed Reader', icon: '⚡', description: 'Read 20 books this year', unlocked: true },
  { id: 5, name: 'Genre Explorer', icon: '🗺️', description: 'Read 5+ different genres', unlocked: false },
  { id: 6, name: 'Stack Builder', icon: '🏗️', description: 'Created 5 custom stacks', unlocked: false }
]

export default function MyStacksPage() {
  const [showCameraUI, setShowCameraUI] = useState(false)
  const [showOCRResults, setShowOCRResults] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [selectedBooks, setSelectedBooks] = useState<number[]>([])

  const handleSnapShelf = useCallback(() => {
    setShowCameraUI(true)
    // Mock camera capture after 2 seconds
    setTimeout(() => {
      setCapturedImage('/api/placeholder/700/500') // Mock shelf image
      setShowCameraUI(false)
      setShowOCRResults(true)
    }, 2000)
  }, [])

  const handleBookSelection = useCallback((bookId: number) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    )
  }, [])

  const handleAddToQueue = useCallback(() => {
    if (selectedBooks.length > 0) {
      // Mock adding books to queue
      alert(`Added ${selectedBooks.length} books to your queue!`)
      setShowOCRResults(false)
      setSelectedBooks([])
      setCapturedImage(null)
    }
  }, [selectedBooks])

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* StackSnap - Core Feature */}
        <section>
          <div className="bg-gradient-to-r from-primary-green to-primary-teal rounded-xl-card p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <h2 className="text-huge font-black mb-2">📸 StackSnap</h2>
            <p className="text-white/90 mb-4">Snap any bookshelf and get instant recommendations powered by OCR</p>
            <div className="flex space-x-3">
              <button 
                onClick={handleSnapShelf}
                className="bg-white text-text-primary px-8 py-4 rounded-pill font-black text-lg shadow-card hover:shadow-card-hover transition-all hover:scale-105"
              >
                📸 SNAP A SHELF
              </button>
              <button className="bg-white/20 text-white px-6 py-4 rounded-pill font-bold border-2 border-white/30 hover:bg-white/30 transition-all">
                View Tutorial
              </button>
            </div>
          </div>
        </section>

        {/* Camera UI Modal */}
        {showCameraUI && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="w-full max-w-md mx-4">
              <div className="bg-gray-900 rounded-3xl p-6 text-white text-center">
                <div className="w-64 h-48 bg-gray-800 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <div className="animate-pulse">
                    <div className="text-6xl mb-2">📸</div>
                    <p className="text-sm text-gray-300">Focusing on shelf...</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">StackSnap Active</h3>
                <p className="text-gray-300 mb-6">Point camera at any bookshelf and tap to capture</p>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowCameraUI(false)}
                    className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-pill font-bold"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-primary-green text-white px-4 py-3 rounded-pill font-bold">
                    Capture
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OCR Results Overlay */}
        {showOCRResults && (
          <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
            <div className="min-h-screen p-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-white">
                  <h2 className="text-xl font-black">📚 Books Detected</h2>
                  <p className="text-gray-300 text-sm">{MOCK_OCR_RESULTS.length} books identified</p>
                </div>
                <button 
                  onClick={() => setShowOCRResults(false)}
                  className="text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Mock shelf image with overlay */}
              <div className="relative bg-gray-800 rounded-2xl mb-6 aspect-[4/3] max-w-2xl mx-auto overflow-hidden">
                <div className="w-full h-full bg-gradient-to-b from-amber-100 to-amber-200 flex items-center justify-center text-4xl text-amber-800">
                  📚 SHELF IMAGE
                </div>
                
                {/* Book detection overlays */}
                {MOCK_OCR_RESULTS.map((book) => {
                  const isSelected = selectedBooks.includes(book.id)
                  return (
                    <button
                      key={book.id}
                      onClick={() => handleBookSelection(book.id)}
                      className={`absolute border-2 rounded-lg transition-all duration-200 ${
                        isSelected 
                          ? 'border-primary-green bg-primary-green/20 shadow-lg' 
                          : 'border-white/60 hover:border-white'
                      }`}
                      style={{
                        left: `${(book.x / 700) * 100}%`,
                        top: `${(book.y / 500) * 100}%`,
                        width: `${(book.width / 700) * 100}%`,
                        height: `${(book.height / 500) * 100}%`,
                      }}
                    >
                      {isSelected && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary-green text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
                          ✓ Selected
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Detected books list */}
              <div className="space-y-3 mb-6">
                {MOCK_OCR_RESULTS.map((book) => {
                  const isSelected = selectedBooks.includes(book.id)
                  return (
                    <div key={book.id} className={`bg-gray-900 rounded-xl p-4 border-2 transition-all ${
                      isSelected ? 'border-primary-green' : 'border-gray-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => handleBookSelection(book.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected 
                                ? 'bg-primary-green border-primary-green text-white' 
                                : 'border-gray-500'
                            }`}
                          >
                            {isSelected && '✓'}
                          </button>
                          <div>
                            <h3 className="font-bold text-white">{book.title}</h3>
                            <p className="text-gray-300 text-sm">{book.author}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${
                            book.confidence >= 90 ? 'text-primary-green' : 
                            book.confidence >= 85 ? 'text-primary-yellow' : 'text-primary-orange'
                          }`}>
                            {book.confidence}% match
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3 max-w-2xl mx-auto">
                <button 
                  onClick={() => setShowOCRResults(false)}
                  className="flex-1 bg-gray-700 text-white px-6 py-4 rounded-pill font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddToQueue}
                  disabled={selectedBooks.length === 0}
                  className="flex-1 bg-primary-green text-white px-6 py-4 rounded-pill font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add {selectedBooks.length > 0 ? `${selectedBooks.length} ` : ''}Books to Queue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Personal Progress - Pace Yo'self */}
        <section>
          <h2 className="text-xl-bold font-black text-text-primary mb-4">
            🎯 Pace Yo'self
          </h2>
          <ReadingStreak />
        </section>

        {/* My Queue */}
        <section>
          <h2 className="text-xl-bold font-black text-text-primary mb-4">
            📚 My Queue
          </h2>
          <MyQueue />
        </section>

        {/* Enhanced Stats Dashboard */}
        <section>
          <h2 className="text-xl-bold font-black text-text-primary mb-4">
            📊 Your Reading Analytics
          </h2>
          
          {/* Main stats grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-primary-orange to-primary-pink rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📚</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-pill">+3 this week</span>
              </div>
              <h3 className="font-black text-3xl">24</h3>
              <p className="text-white/90 text-sm font-bold">Books Read This Year</p>
            </div>
            
            <div className="bg-gradient-to-br from-primary-purple to-primary-pink rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📄</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-pill">+127 this week</span>
              </div>
              <h3 className="font-black text-3xl">1,247</h3>
              <p className="text-white/90 text-sm font-bold">Total Pages</p>
            </div>
            
            <div className="bg-gradient-to-br from-primary-teal to-primary-green rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">🎭</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-pill">2 new genres</span>
              </div>
              <h3 className="font-black text-3xl">7</h3>
              <p className="text-white/90 text-sm font-bold">Genres Explored</p>
            </div>
            
            <div className="bg-gradient-to-br from-primary-blue to-primary-purple rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">⏱️</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-pill">6h this week</span>
              </div>
              <h3 className="font-black text-3xl">45</h3>
              <p className="text-white/90 text-sm font-bold">Reading Hours</p>
            </div>
          </div>
          
          {/* Achievement badges */}
          <div className="bg-white rounded-xl-card p-5 shadow-card">
            <h3 className="font-bold text-text-primary mb-4 flex items-center">
              <span className="text-xl mr-2">🏆</span>
              Achievement Badges
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {ACHIEVEMENT_BADGES.map((badge) => (
                <div key={badge.id} className={`text-center p-3 rounded-xl transition-all ${
                  badge.unlocked 
                    ? 'bg-primary-yellow/20 border-2 border-primary-yellow/30' 
                    : 'bg-gray-100 border-2 border-gray-200 opacity-60'
                }`}>
                  <div className={`text-2xl mb-1 ${
                    badge.unlocked ? '' : 'grayscale'
                  }`}>
                    {badge.icon}
                  </div>
                  <h4 className={`text-xs font-bold mb-1 ${
                    badge.unlocked ? 'text-text-primary' : 'text-gray-400'
                  }`}>
                    {badge.name}
                  </h4>
                  <p className={`text-xs ${
                    badge.unlocked ? 'text-text-secondary' : 'text-gray-400'
                  }`}>
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-text-secondary mb-2">
                {ACHIEVEMENT_BADGES.filter(b => b.unlocked).length} of {ACHIEVEMENT_BADGES.length} badges unlocked
              </p>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-green to-primary-teal h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(ACHIEVEMENT_BADGES.filter(b => b.unlocked).length / ACHIEVEMENT_BADGES.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent StackSnaps */}
        <section>
          <h2 className="text-xl-bold font-black text-text-primary mb-4">
            📷 Recent StackSnaps
          </h2>
          <div className="space-y-3">
            {['Coffee Shop Shelf', 'Friend\'s Collection', 'Library Display'].map((snap) => (
              <div key={snap} className="bg-white rounded-xl p-4 shadow-card flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-text-primary">{snap}</h3>
                  <p className="text-sm text-text-secondary">5 books identified • 3 added</p>
                </div>
                <button className="bg-primary-orange text-white px-4 py-2 rounded-pill font-bold text-sm">
                  View
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MobileLayout>
  )
}