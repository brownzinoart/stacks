/**
 * Discover page - Vibe Search + Geo-based community book discovery
 * Core Features: Natural language search, geo-trending, community highlights
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MobileLayout } from '@/components/mobile-layout'
import { NavigationCard } from '@/components/navigation-card'
import { CommunityDiscoveries } from '@/features/home/community-discoveries'

// Mock data for trending books in area
const TRENDING_BOOKS_LOCAL = [
  { id: 1, title: 'Fourth Wing', author: 'Rebecca Yarros', genre: 'Fantasy Romance', saves: 234, trend: '+15%' },
  { id: 2, title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', genre: 'Historical Fiction', saves: 189, trend: '+8%' },
  { id: 3, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', saves: 156, trend: '+22%' },
  { id: 4, title: 'It Ends with Us', author: 'Colleen Hoover', genre: 'Contemporary Romance', saves: 145, trend: '+5%' },
  { id: 5, title: 'The Song of Achilles', author: 'Madeline Miller', genre: 'Literary Fiction', saves: 132, trend: '+12%' }
]

const COMMUNITY_HIGHLIGHTS = [
  {
    id: 1,
    user: '@bookworm_alex',
    avatar: '📚',
    action: 'shared a stack',
    title: 'Cozy Fall Reads',
    time: '2 hours ago',
    books: 8,
    likes: 45
  },
  {
    id: 2,
    user: '@literary_luna',
    avatar: '🌙',
    action: 'recommended',
    title: 'The Midnight Library',
    time: '4 hours ago',
    books: 1,
    likes: 32
  },
  {
    id: 3,
    user: '@sci_fi_sarah',
    avatar: '🚀',
    action: 'created a learning stack',
    title: 'Space Exploration 101',
    time: '6 hours ago',
    books: 12,
    likes: 28
  }
]

const TRENDING_HASHTAGS = [
  { tag: '#BookTok', count: '2.3M', color: 'bg-primary-pink' },
  { tag: '#DarkAcademia', count: '845K', color: 'bg-primary-purple' },
  { tag: '#CozyReads', count: '567K', color: 'bg-primary-orange' },
  { tag: '#ScienceFiction', count: '432K', color: 'bg-primary-blue' },
  { tag: '#Romance', count: '1.2M', color: 'bg-primary-pink' },
  { tag: '#Productivity', count: '398K', color: 'bg-primary-green' }
]

// Inspirational search prompts that rotate to help users
const SEARCH_PROMPTS = [
  "I'm stressed, need something calming",
  "books like Dune but shorter", 
  "Taylor Swift feels",
  "dark academia vibes",
  "make me cry happy tears",
  "witchy autumn energy",
  "books that feel like summer",
  "something mind-bending",
  "cozy mystery night",
  "enemies to lovers please"
]

export default function DiscoverPage() {
  const router = useRouter()
  const [userLocation, setUserLocation] = useState('San Francisco Bay Area')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Rotate prompts every 4 seconds with smooth crossfade
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      
      // Complete fade out, then change text, then fade in
      setTimeout(() => {
        setCurrentPromptIndex((prev) => (prev + 1) % SEARCH_PROMPTS.length)
      }, 800) // Change text after complete fade out
      
      setTimeout(() => {
        setIsTransitioning(false)
      }, 1000) // Start fade in after text change
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    // Navigate to search results page with the query
    router.push(`/search-results?q=${encodeURIComponent(searchQuery)}`)
  }
  
  const handleMoodSearch = async (mood: string) => {
    setIsLoading(true)
    // Navigate to search results page with mood query
    const moodQuery = `I'm feeling ${mood.toLowerCase()} and want book recommendations`
    router.push(`/search-results?q=${encodeURIComponent(moodQuery)}`)
  }
  
  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* WHAT'S NEXT - Lead Feature Card */}
        <section>
          <div className="hero-feature-card hero-card-green">
            <div className="hero-card-content">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="hero-card-title-large">
                    <span className="text-pink-300">WHAT'S</span>
                    <br />
                    <span>NEXT?</span>
                  </h1>
                </div>
                <div className="rounded-full bg-black px-3 py-2 text-sm font-black text-white sm:px-4" style={{border: '2px solid #000'}}>
                  AI POWERED
                </div>
              </div>

              <p className="hero-card-subtitle">
                Tell us what you're into! Get instant recommendations for your next read!
              </p>

              {/* AI Search Input */}
              <div className="hero-card-inner-white">
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder=""
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="hero-search-input"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    {/* Animated placeholder overlay */}
                    {!searchQuery && (
                      <div 
                        className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 font-bold text-base transition-opacity duration-[800ms] ease-in-out select-none ${
                          isTransitioning ? 'opacity-0' : 'opacity-100'
                        }`}
                        style={{ paddingLeft: '0px', paddingTop: '1px' }}
                      >
                        <span className="text-gray-400 font-normal">try: </span>
                        {SEARCH_PROMPTS[currentPromptIndex]}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isLoading}
                    className="hero-search-button"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Finding Your Perfect Match...
                      </div>
                    ) : (
                      'Find Next Read'
                    )}
                  </button>
                </div>
              </div>

              {/* Mood Buttons Section - Matching the image */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => handleMoodSearch('Funny')}
                  disabled={isLoading}
                  className="hero-mood-button-funny"
                >
                  <div className="text-xl mb-1 font-black">FUNNY</div>
                </button>
                
                <button
                  onClick={() => handleMoodSearch('Mind-blowing')}
                  disabled={isLoading}
                  className="hero-mood-button-mindblowing"
                >
                  <div className="text-xl mb-1 font-black">MIND-BLOWING</div>
                </button>
                
                <button
                  onClick={() => handleMoodSearch('Love Story')}
                  disabled={isLoading}
                  className="hero-mood-button-lovestory"
                >
                  <div className="text-xl mb-1 font-black">LOVE STORY</div>
                </button>
                
                <button
                  onClick={() => handleMoodSearch('Magical')}
                  disabled={isLoading}
                  className="hero-mood-button-magical"
                >
                  <div className="text-xl mb-1 font-black">MAGICAL</div>
                </button>
              </div>
            </div>

            {/* Decorative elements - Same pattern as other hero cards */}
            <div className="animate-float absolute left-4 top-6 z-0 h-12 w-12 rounded-full bg-primary-teal opacity-25 sm:h-16 sm:w-16" />
            <div className="animate-float-delayed absolute bottom-6 right-4 z-0 h-10 w-10 rounded-full bg-primary-orange opacity-30 sm:h-14 sm:w-14" />
            <div className="animate-float-slow absolute right-8 top-2 z-0 h-8 w-8 rounded-full bg-primary-blue opacity-35 sm:h-12 sm:w-12" />
            <div className="animate-float sm:h-18 sm:w-18 absolute bottom-8 left-6 z-0 h-14 w-14 rounded-full bg-primary-yellow opacity-20" />
            <div className="animate-float-delayed absolute left-2 top-10 z-0 h-6 w-6 rounded-full bg-primary-pink opacity-40 sm:h-8 sm:w-8" />
            <div className="animate-float-slow absolute bottom-4 left-2 z-0 h-10 w-10 rounded-full bg-primary-purple opacity-30 sm:h-12 sm:w-12" />
          </div>
        </section>

        {/* More Ways to Discover */}
        <section>
          <h2 className="text-xl font-black text-text-primary mb-4">
            📈 More Ways to Discover
          </h2>
        </section>

        {/* What People Are Reading in Your Area */}
        <section>
          <h2 className="text-xl-bold font-black text-text-primary mb-4">
            📍 What People Are Reading in Your Area
          </h2>
          
          {/* Location indicator */}
          <div className="bg-gradient-to-r from-primary-blue to-primary-teal rounded-2xl p-4 mb-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">📍 San Francisco Bay Area</h3>
                <p className="text-white/80 text-sm">Updated 2 hours ago</p>
              </div>
              <button className="bg-white/20 rounded-pill px-3 py-1 text-sm font-bold">
                Change
              </button>
            </div>
          </div>
          
          {/* Trending books list */}
          <div className="space-y-3">
            {TRENDING_BOOKS_LOCAL.slice(0, 5).map((book, index) => (
              <div key={book.id} className="bg-white rounded-xl p-4 shadow-card flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white ${
                    index === 0 ? 'bg-primary-yellow' : 
                    index === 1 ? 'bg-primary-orange' : 
                    index === 2 ? 'bg-primary-pink' :
                    'bg-primary-purple'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary">{book.title}</h3>
                    <p className="text-sm text-text-secondary">{book.author} • {book.genre}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-primary-green font-bold text-sm">{book.trend}</div>
                  <div className="text-xs text-text-secondary">{book.saves} saves</div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 bg-white rounded-xl p-3 shadow-card font-bold text-text-primary border-2 border-white hover:border-primary-blue transition-colors">
            View All Trending Books
          </button>
        </section>

        {/* Trending Hashtags */}
        <section>
          <h2 className="text-xl-bold font-black text-text-primary mb-4">
            📈 Trending Now
          </h2>
          <div className="flex overflow-x-auto space-x-3 pb-2 -mx-4 px-4">
            {TRENDING_HASHTAGS.map((hashtag) => (
              <div key={hashtag.tag} className={`${hashtag.color} text-white rounded-2xl px-4 py-3 min-w-fit flex-shrink-0`}>
                <div className="font-bold">{hashtag.tag}</div>
                <div className="text-xs text-white/80">{hashtag.count} posts</div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Activity Feed */}
        <section>
          <h2 className="text-xl-bold font-black text-text-primary mb-4">
            👥 Community Highlights
          </h2>
          <div className="space-y-3">
            {COMMUNITY_HIGHLIGHTS.map((highlight) => (
              <div key={highlight.id} className="bg-white rounded-xl-card p-4 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{highlight.avatar}</div>
                    <div>
                      <div className="font-bold text-text-primary">{highlight.user}</div>
                      <div className="text-xs text-text-secondary">{highlight.time}</div>
                    </div>
                  </div>
                  <button className="text-primary-pink font-bold text-sm">♥ {highlight.likes}</button>
                </div>
                <p className="text-text-secondary mb-2">
                  <span className="font-bold">{highlight.action}</span> "{highlight.title}"
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">{highlight.books} book{highlight.books !== 1 ? 's' : ''}</span>
                  <button className="bg-primary-blue text-white px-4 py-2 rounded-pill text-sm font-bold">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <CommunityDiscoveries />
        </section>

        {/* Popular Stacks */}
        <section>
          <h2 className="text-xl-bold font-black text-text-primary mb-4">
            🔥 Popular Stacks This Week
          </h2>
          <div className="space-y-4">
            {[
              { name: 'BookTok Favorites', books: 15, saves: 2340, creator: '@bookish_babe', color: 'bg-primary-pink' },
              { name: 'Dark Academia Vibes', books: 12, saves: 1890, creator: '@literature_lover', color: 'bg-primary-purple' },
              { name: 'Quick Summer Reads', books: 8, saves: 1560, creator: '@beach_books', color: 'bg-primary-yellow' },
              { name: 'Sci-Fi Essentials', books: 20, saves: 1340, creator: '@space_reader', color: 'bg-primary-blue' },
              { name: 'Cozy Mystery Corner', books: 10, saves: 1120, creator: '@mystery_maven', color: 'bg-primary-orange' }
            ].map((stack, index) => (
              <div key={stack.name} className="bg-white rounded-xl-card p-5 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${stack.color} rounded-xl flex items-center justify-center text-white font-black text-lg`}>
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-black text-text-primary">{stack.name}</h3>
                      <p className="text-sm text-text-secondary">by {stack.creator}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-text-primary">{stack.saves.toLocaleString()}</div>
                    <div className="text-xs text-text-secondary">saves</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">{stack.books} books in stack</span>
                  <div className="flex space-x-2">
                    <button className="bg-primary-green text-white px-4 py-2 rounded-pill text-sm font-bold">
                      Add to Queue
                    </button>
                    <button className="border-2 border-primary-blue text-primary-blue px-4 py-2 rounded-pill text-sm font-bold">
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial Picks */}
        <section>
          <h2 className="text-xl-bold font-black text-text-primary mb-4">
            ✨ Staff Picks & Expert Curation
          </h2>
          
          {/* Feature editorial pick */}
          <div className="bg-gradient-to-r from-primary-purple to-primary-pink rounded-xl-card p-6 text-white mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-black text-xl mb-1">This Month's Feature</h3>
                <p className="text-white/90">Curated by SF Public Library</p>
              </div>
              <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-bold">
                FEATURED
              </div>
            </div>
            <h4 className="font-black text-lg mb-2">&ldquo;Climate Fiction That Matters&rdquo;</h4>
            <p className="text-white/90 mb-4">8 powerful books exploring our planet's future through compelling storytelling</p>
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="font-bold">456</span> people added this stack
              </div>
              <button className="bg-white text-text-primary px-6 py-3 rounded-pill font-bold">
                Explore Collection
              </button>
            </div>
          </div>
          
          {/* Other expert picks */}
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                title: 'BookTok Hidden Gems',
                curator: '@literarytiktok',
                description: 'Underrated books that deserve viral fame',
                books: 12,
                color: 'bg-primary-teal'
              },
              {
                title: 'Academic Reading Made Fun',
                curator: 'Stanford Literature Dept',
                description: 'Complex ideas made accessible',
                books: 15,
                color: 'bg-primary-blue'
              },
              {
                title: 'Diverse Voices Rising',
                curator: 'Independent Bookstore Alliance',
                description: 'Authors breaking boundaries',
                books: 20,
                color: 'bg-primary-orange'
              }
            ].map((pick) => (
              <div key={pick.title} className={`${pick.color} rounded-xl p-5 text-white`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold">{pick.title}</h4>
                    <p className="text-white/80 text-sm">{pick.curator}</p>
                  </div>
                  <span className="text-xs bg-white/20 rounded-pill px-2 py-1">{pick.books} books</span>
                </div>
                <p className="text-white/90 text-sm mb-3">{pick.description}</p>
                <button className="bg-white/20 text-white px-4 py-2 rounded-pill text-sm font-bold hover:bg-white/30 transition-colors">
                  View Collection
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MobileLayout>
  )
}