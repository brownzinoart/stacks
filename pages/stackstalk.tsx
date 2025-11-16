/**
 * StacksTalk page - Community/Social features
 * Features: BookTok integration, In-app sharing, Influencer collabs
 */

import { MobileLayout } from '@/components/mobile-layout'

export default function StacksTalkPage() {
  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* BookTok Integration */}
        <section>
          <div className="bg-gradient-to-r from-primary-pink to-primary-purple rounded-xl-card p-6 text-white">
            <h2 className="text-huge font-black mb-2">#BookTok</h2>
            <p className="text-white/90 mb-4">Latest book content from TikTok creators</p>
            <button className="bg-white text-text-primary px-6 py-3 rounded-pill font-bold">
              Browse BookTok
            </button>
          </div>
        </section>

        {/* In-app Sharing Feed */}
        <section>
          <h2 className="text-xl-bold font-black text-text-primary mb-4">
            📱 Community Feed
          </h2>
          <div className="space-y-4">
            {['Stack Review', 'Shelf Snap', 'Book Notes'].map((type) => (
              <div key={type} className="bg-white rounded-xl-card p-4 shadow-card">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-primary-green rounded-full mr-3"></div>
                  <div>
                    <h3 className="font-bold text-text-primary">@booklover23</h3>
                    <p className="text-xs text-text-secondary">2 hours ago • {type}</p>
                  </div>
                </div>
                <p className="text-text-secondary mb-3">Just finished this amazing stack! The recommendations were spot on 📚✨</p>
                <div className="flex space-x-4 text-sm">
                  <button className="text-primary-pink font-bold">♥ 24</button>
                  <button className="text-primary-blue font-bold">💬 5</button>
                  <button className="text-primary-green font-bold">📤 Share</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Influencer Highlights */}
        <section>
          <h2 className="text-xl-bold font-black text-text-primary mb-4">
            ⭐ Creator Highlights
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {['@bookgirl_reads', '@ya_bookworm'].map((creator) => (
              <div key={creator} className="bg-white rounded-xl p-4 shadow-card text-center">
                <div className="w-16 h-16 bg-primary-orange rounded-full mx-auto mb-3"></div>
                <h3 className="font-bold text-text-primary">{creator}</h3>
                <p className="text-xs text-text-secondary mb-3">BookTok Creator • 50K followers</p>
                <button className="bg-primary-purple text-white px-4 py-2 rounded-pill text-sm font-bold">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MobileLayout>
  )
}