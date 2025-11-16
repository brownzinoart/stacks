/**
 * Learn page - Topic-Based Learning Stacks
 * Core Feature: Subject input → curated multi-angle book stacks
 * Future: Library Map Integration showing book locations
 */

'use client'

import { useState, useCallback } from 'react'
import { MobileLayout } from '@/components/mobile-layout'
import AnimatedPlaceholder from '@/components/animated-placeholder'
import { NavigationCard } from '@/components/navigation-card'
import Head from 'next/head'

const LEARNING_TOPICS = [
  { id: 'science', name: '🔬 Science', color: 'bg-primary-blue', description: 'From quantum physics to biology' },
  { id: 'history', name: '📜 History', color: 'bg-primary-orange', description: 'Ancient civilizations to modern events' },
  { id: 'art', name: '🎨 Art & Design', color: 'bg-primary-pink', description: 'Creative expression & visual culture' },
  { id: 'tech', name: '💻 Technology', color: 'bg-primary-purple', description: 'AI, coding, and digital innovation' },
  { id: 'business', name: '💼 Business', color: 'bg-primary-green', description: 'Entrepreneurship & leadership' },
  { id: 'philosophy', name: '🧠 Philosophy', color: 'bg-primary-teal', description: 'Big questions & critical thinking' },
  { id: 'health', name: '🏥 Health & Medicine', color: 'bg-primary-yellow', description: 'Wellness & medical advances' },
  { id: 'environment', name: '🌱 Environment', color: 'bg-primary-green', description: 'Climate change & sustainability' }
]

const LEARNING_PLACEHOLDERS = [
  "What do you want to learn? 📚",
  "quantum physics basics",
  "modern art movements",
  "climate change science",
  "Ancient Rome history",
  "machine learning intro",
  "philosophy of mind",
  "startup fundamentals",
  "nutrition science",
  "space exploration"
]

const FEATURED_LEARNING_PATHS = [
  {
    id: 'ai-basics',
    title: 'AI & Machine Learning',
    subtitle: 'From beginner to advanced',
    bookCount: 12,
    difficulty: 'Beginner → Expert',
    timeEstimate: '6-8 weeks',
    color: 'bg-gradient-to-r from-primary-purple to-primary-blue',
    angles: ['Technical Foundations', 'Ethics & Philosophy', 'Real-world Applications']
  },
  {
    id: 'climate-science',
    title: 'Climate Change Science',
    subtitle: 'Understanding our planet',
    bookCount: 8,
    difficulty: 'Intermediate',
    timeEstimate: '4-5 weeks',
    color: 'bg-gradient-to-r from-primary-green to-primary-teal',
    angles: ['Scientific Research', 'Policy & Solutions', 'Personal Action']
  },
  {
    id: 'ancient-civilizations',
    title: 'Ancient Civilizations',
    subtitle: 'Rome, Egypt, Greece & more',
    bookCount: 15,
    difficulty: 'Beginner',
    timeEstimate: '8-10 weeks',
    color: 'bg-gradient-to-r from-primary-orange to-primary-pink',
    angles: ['Political History', 'Daily Life', 'Cultural Legacy']
  }
]

export default function LearnPage() {
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isPlaceholderActive = !isFocused && !inputValue.trim() && !isLoading

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    // Mock learning stack generation
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      // In real app, this would generate learning stacks
      alert(`Generating learning stacks for: "${inputValue}"`)
    }, 2000)
  }, [inputValue])

  const handleTopicClick = useCallback((topic: typeof LEARNING_TOPICS[0]) => {
    setInputValue(`${topic.name.split(' ').slice(1).join(' ')} fundamentals`)
    // Auto-submit for quick topic exploration
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert(`Generating learning stacks for: "${topic.description}"`)
    }, 2000)
  }, [])

  return (
    <>
      <Head>
        <title>Learn - Stacks</title>
        <meta name="description" content="Topic-based learning with curated book stacks" />
      </Head>
      
      <MobileLayout>
        <div className="p-4 space-y-6">
          {/* Topic Search Input */}
          <section>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder=""
                  className="w-full rounded-3xl border-2 border-white/30 bg-white/95 backdrop-blur-xl px-6 py-5 text-lg font-bold placeholder-gray-500 focus:border-primary-blue focus:outline-none focus:ring-4 focus:ring-primary-blue/30 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.1)] focus:shadow-[0_20px_40px_rgba(59,130,246,0.3)] focus:bg-white/98 text-text-primary"
                  disabled={isLoading}
                />
                <AnimatedPlaceholder
                  examples={LEARNING_PLACEHOLDERS}
                  isActive={isPlaceholderActive}
                  className="absolute inset-0"
                />
              </div>
              
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-full rounded-3xl bg-gradient-to-r from-primary-blue to-primary-purple px-8 py-5 text-xl font-black text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(102,126,234,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                {isLoading ? 'Generating Learning Stack...' : 'Create Learning Stack'}
              </button>
            </form>
          </section>

          {/* Subject Categories */}
          <section>
            <h2 className="text-xl-bold font-black text-text-primary mb-4">
              🎓 Popular Learning Topics
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {LEARNING_TOPICS.map((topic) => (
                <NavigationCard
                  key={topic.id}
                  title={topic.name}
                  subtitle={topic.description}
                  className={`${topic.color} text-white hover:scale-105 transition-all duration-300`}
                  onClick={() => handleTopicClick(topic)}
                />
              ))}
            </div>
          </section>

          {/* Featured Learning Paths */}
          <section>
            <h2 className="text-xl-bold font-black text-text-primary mb-4">
              ⭐ Featured Learning Paths
            </h2>
            <div className="space-y-4">
              {FEATURED_LEARNING_PATHS.map((path) => (
                <div key={path.id} className={`${path.color} rounded-xl-card p-6 text-white shadow-card`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-black">{path.title}</h3>
                      <p className="text-white/90">{path.subtitle}</p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-bold">{path.bookCount} books</div>
                      <div className="text-white/80">{path.timeEstimate}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-bold mb-2">📚 Multi-angle approach:</div>
                    <div className="flex flex-wrap gap-2">
                      {path.angles.map((angle, index) => (
                        <span key={index} className="bg-white/20 rounded-pill px-3 py-1 text-xs font-bold">
                          {angle}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-bold">Difficulty:</span> {path.difficulty}
                    </div>
                    <button className="bg-white text-text-primary px-6 py-2 rounded-pill font-bold hover:scale-105 transition-transform">
                      Start Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Progress Tracking Teaser */}
          <section>
            <h2 className="text-xl-bold font-black text-text-primary mb-4">
              📊 Your Learning Progress
            </h2>
            <div className="bg-white rounded-xl-card p-6 shadow-card">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-bold text-text-primary">Track Your Learning Journey</h3>
                <p className="text-sm text-text-secondary mt-2">
                  Set learning goals, track reading progress, and celebrate milestones
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-primary-blue">0</div>
                  <div className="text-xs text-text-secondary">Topics Mastered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-primary-green">0</div>
                  <div className="text-xs text-text-secondary">Learning Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-primary-purple">0</div>
                  <div className="text-xs text-text-secondary">Active Stacks</div>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-gradient-to-r from-primary-blue to-primary-purple text-white px-6 py-3 rounded-pill font-bold">
                Start Your First Learning Stack
              </button>
            </div>
          </section>
        </div>
      </MobileLayout>
    </>
  )
}